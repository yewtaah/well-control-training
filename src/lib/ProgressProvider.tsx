"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { courses, getCourse, lessonCount, lessonKey } from "@/lib/curriculum";
import { getClient } from "@/lib/dataClient";
import { isoDay, percent } from "@/lib/analytics";

export type CourseProgress = {
  enrollmentId?: string;
  completedLessons: Set<string>;
  bestQuizPercent?: number;
  quizPassed: boolean;
  dueAt?: string;
};

type QuizOutcome = {
  scorePercent: number;
  passed: boolean;
  questionCount: number;
  correctCount: number;
};

type ProgressContextValue = {
  ready: boolean;
  /** Non-fatal backend error; the UI stays usable and simply shows no progress. */
  error: string | null;
  byCourse: Record<string, CourseProgress>;
  toggleLesson: (
    courseSlug: string,
    moduleSlug: string,
    lessonSlug: string
  ) => Promise<void>;
  recordQuizAttempt: (courseSlug: string, result: QuizOutcome) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function emptyProgress(): CourseProgress {
  return { completedLessons: new Set(), quizPassed: false };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byCourse, setByCourse] = useState<Record<string, CourseProgress>>({});
  const traineeId = useRef<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
      try {
        const client = getClient();
        const user = await getCurrentUser();
        const attributes: Record<string, string | undefined> =
          await fetchUserAttributes().catch(() => ({}));
        const email =
          attributes.email ?? user.signInDetails?.loginId ?? user.userId;
        const now = new Date().toISOString();

        // Find or create the trainee record, then log the sign-in.
        const existing = await client.models.Trainee.listTraineeByEmail({
          email,
        });
        type TraineeRecord = NonNullable<typeof existing.data>[number];
        let trainee: TraineeRecord | undefined = existing.data?.[0];
        let isNewTrainee = false;

        if (trainee) {
          await client.models.Trainee.update({
            id: trainee.id,
            lastSeenAt: now,
            signInCount: (trainee.signInCount ?? 0) + 1,
          });
        } else {
          const created = await client.models.Trainee.create({
            email,
            displayName: attributes.preferred_username ?? email,
            company: attributes["custom:company"],
            jobTitle: attributes["custom:jobTitle"],
            signedUpAt: now,
            lastSeenAt: now,
            signInCount: 1,
          });
          trainee = created.data ?? undefined;
          isNewTrainee = true;
        }

        if (!trainee) throw new Error("Could not create the trainee record");
        traineeId.current = trainee.id;

        await client.models.ActivityEvent.create({
          traineeId: trainee.id,
          type: isNewTrainee ? "SIGN_UP" : "SIGN_IN",
          day: isoDay(),
          occurredAt: now,
        });

        // Load standing across all courses.
        const [enrollments, completions] = await Promise.all([
          client.models.Enrollment.list({ limit: 200 }),
          client.models.LessonCompletion.list({ limit: 1000 }),
        ]);

        const next: Record<string, CourseProgress> = {};
        for (const enrollment of enrollments.data ?? []) {
          next[enrollment.courseSlug] = {
            enrollmentId: enrollment.id,
            completedLessons: new Set(),
            bestQuizPercent: enrollment.bestQuizPercent ?? undefined,
            quizPassed: enrollment.quizPassed ?? false,
            dueAt: enrollment.dueAt ?? undefined,
          };
        }
        for (const completion of completions.data ?? []) {
          const course = (next[completion.courseSlug] ??= emptyProgress());
          course.completedLessons.add(
            lessonKey(completion.moduleSlug, completion.lessonSlug)
          );
        }

        setByCourse(next);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
      } finally {
        setReady(true);
      }
    })();
  }, []);

  /** Create the enrollment row on first interaction with a course. */
  const ensureEnrollment = useCallback(
    async (courseSlug: string): Promise<string | undefined> => {
      const existing = byCourse[courseSlug]?.enrollmentId;
      if (existing) return existing;

      const course = getCourse(courseSlug);
      if (!course || !traineeId.current) return undefined;

      const client = getClient();
      const now = new Date().toISOString();
      const created = await client.models.Enrollment.create({
        traineeId: traineeId.current,
        courseSlug: course.slug,
        courseTitle: course.title,
        status: "IN_PROGRESS",
        lessonsCompleted: 0,
        lessonsTotal: lessonCount(course),
        percentComplete: 0,
        quizPassed: false,
        startedAt: now,
      });
      const enrollmentId = created.data?.id;
      if (!enrollmentId) return undefined;

      await client.models.ActivityEvent.create({
        traineeId: traineeId.current,
        type: "COURSE_STARTED",
        day: isoDay(),
        courseSlug: course.slug,
        occurredAt: now,
      });

      setByCourse((current) => ({
        ...current,
        [courseSlug]: { ...(current[courseSlug] ?? emptyProgress()), enrollmentId },
      }));
      return enrollmentId;
    },
    [byCourse]
  );

  const toggleLesson = useCallback(
    async (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      const key = lessonKey(moduleSlug, lessonSlug);
      const course = getCourse(courseSlug);
      if (!course) return;

      const previouslyComplete =
        byCourse[courseSlug]?.completedLessons.has(key) ?? false;

      // Optimistic update — the UI must not wait on the round trip.
      setByCourse((current) => {
        const existing = current[courseSlug] ?? emptyProgress();
        const completedLessons = new Set(existing.completedLessons);
        if (previouslyComplete) completedLessons.delete(key);
        else completedLessons.add(key);
        return { ...current, [courseSlug]: { ...existing, completedLessons } };
      });

      try {
        const client = getClient();
        const enrollmentId = await ensureEnrollment(courseSlug);
        if (!enrollmentId || !traineeId.current) return;

        const now = new Date().toISOString();
        const rows = await client.models.LessonCompletion.list({
          filter: {
            enrollmentId: { eq: enrollmentId },
            moduleSlug: { eq: moduleSlug },
            lessonSlug: { eq: lessonSlug },
          },
        });
        const row = rows.data?.[0];

        if (previouslyComplete) {
          if (row) await client.models.LessonCompletion.delete({ id: row.id });
        } else if (!row) {
          await client.models.LessonCompletion.create({
            enrollmentId,
            traineeId: traineeId.current,
            courseSlug,
            moduleSlug,
            lessonSlug,
            completedAt: now,
          });
          await client.models.ActivityEvent.create({
            traineeId: traineeId.current,
            type: "LESSON_COMPLETED",
            day: isoDay(),
            courseSlug,
            detail: key,
            occurredAt: now,
          });
        }

        const total = lessonCount(course);
        const previousCount = byCourse[courseSlug]?.completedLessons.size ?? 0;
        const done = previouslyComplete
          ? Math.max(0, previousCount - 1)
          : previousCount + 1;
        const isCourseComplete = done >= total;

        await client.models.Enrollment.update({
          id: enrollmentId,
          lessonsCompleted: done,
          percentComplete: percent(done, total),
          status: isCourseComplete ? "COMPLETED" : "IN_PROGRESS",
          completedAt: isCourseComplete ? now : null,
        });

        if (isCourseComplete && !previouslyComplete) {
          await client.models.ActivityEvent.create({
            traineeId: traineeId.current,
            type: "COURSE_COMPLETED",
            day: isoDay(),
            courseSlug,
            occurredAt: now,
          });
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [byCourse, ensureEnrollment]
  );

  const recordQuizAttempt = useCallback(
    async (courseSlug: string, result: QuizOutcome) => {
      const previousBest = byCourse[courseSlug]?.bestQuizPercent ?? 0;
      const previouslyPassed = byCourse[courseSlug]?.quizPassed ?? false;

      setByCourse((current) => {
        const existing = current[courseSlug] ?? emptyProgress();
        return {
          ...current,
          [courseSlug]: {
            ...existing,
            bestQuizPercent: Math.max(
              existing.bestQuizPercent ?? 0,
              result.scorePercent
            ),
            quizPassed: existing.quizPassed || result.passed,
          },
        };
      });

      try {
        const client = getClient();
        const enrollmentId = await ensureEnrollment(courseSlug);
        if (!enrollmentId || !traineeId.current) return;

        const now = new Date().toISOString();
        await client.models.QuizAttempt.create({
          enrollmentId,
          traineeId: traineeId.current,
          courseSlug,
          scorePercent: result.scorePercent,
          passed: result.passed,
          questionCount: result.questionCount,
          correctCount: result.correctCount,
          attemptedAt: now,
        });
        await client.models.ActivityEvent.create({
          traineeId: traineeId.current,
          type: "QUIZ_ATTEMPTED",
          day: isoDay(),
          courseSlug,
          detail: `${result.scorePercent}%`,
          occurredAt: now,
        });

        if (result.scorePercent >= previousBest || result.passed) {
          await client.models.Enrollment.update({
            id: enrollmentId,
            bestQuizPercent: Math.max(previousBest, result.scorePercent),
            quizPassed: previouslyPassed || result.passed,
          });
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [byCourse, ensureEnrollment]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({ ready, error, byCourse, toggleLesson, recordQuizAttempt }),
    [ready, error, byCourse, toggleLesson, recordQuizAttempt]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(courseSlug: string) {
  const context = useContext(ProgressContext);
  const course = context?.byCourse[courseSlug];
  const completed = course?.completedLessons ?? new Set<string>();

  return {
    completed,
    loaded: context?.ready ?? false,
    error: context?.error ?? null,
    isComplete: (key: string) => completed.has(key),
    toggleComplete: (moduleSlug: string, lessonSlug: string) =>
      void context?.toggleLesson(courseSlug, moduleSlug, lessonSlug),
    quizResult: course?.bestQuizPercent
      ? { scorePercent: course.bestQuizPercent, passed: course.quizPassed }
      : null,
    recordQuizResult: (result: QuizOutcome) =>
      void context?.recordQuizAttempt(courseSlug, result),
  };
}

/** Program-wide roll-up used by the overview page. */
export function useProgramProgress() {
  const context = useContext(ProgressContext);
  const totals = courses.map((course) => {
    const progress = context?.byCourse[course.slug];
    return {
      course,
      completedLessons: progress?.completedLessons.size ?? 0,
      totalLessons: lessonCount(course),
      quizPassed: progress?.quizPassed ?? false,
    };
  });
  return { ready: context?.ready ?? false, totals };
}
