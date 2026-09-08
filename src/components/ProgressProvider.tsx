"use client";

import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth";
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
import { getDataClient, utcDay, type DataClient } from "@/lib/amplifyClient";
import { courses, getCourse, lessonCount, lessonKey } from "@/lib/curriculum";
import {
  clearLegacyProgress,
  emptyProgress,
  enqueue,
  readCache,
  readLegacyProgress,
  readPending,
  writeCache,
  writePending,
  type PendingWrite,
  type ProgressData,
  type QuizResult,
} from "@/lib/progressCache";

type ActivityType =
  | "SIGN_UP"
  | "SIGN_IN"
  | "LESSON_COMPLETED"
  | "QUIZ_ATTEMPTED"
  | "COURSE_COMPLETED";

export type QuizAttemptInput = {
  scorePercent: number;
  correctCount: number;
  questionCount: number;
  passed: boolean;
};

export type ProgressContextValue = {
  /** False until the first read — cache or server — has landed. */
  loaded: boolean;
  /** True once the server copy is in hand; false means we are on cached data. */
  synced: boolean;
  traineeId: string | null;
  traineeEmail: string;
  isAdmin: boolean;
  data: ProgressData;
  setLessonCompleted: (
    courseSlug: string,
    moduleSlug: string,
    lessonSlug: string,
    completed: boolean
  ) => void;
  recordQuizAttempt: (courseSlug: string, attempt: QuizAttemptInput) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

type Ids = {
  /** courseSlug -> Enrollment id */
  enrollment: Record<string, string>;
  /** `courseSlug|moduleSlug/lessonSlug` -> LessonCompletion id */
  lesson: Record<string, string>;
};

function unwrap<T>(result: { data: T; errors?: { message: string }[] }): T {
  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }
  return result.data;
}

async function listAll<T>(
  fetchPage: (nextToken?: string) => Promise<{
    data: T[];
    errors?: { message: string }[];
    nextToken?: string | null;
  }>
): Promise<T[]> {
  const all: T[] = [];
  let token: string | undefined;
  do {
    const page = await fetchPage(token);
    all.push(...unwrap(page));
    token = page.nextToken ?? undefined;
  } while (token);
  return all;
}

function completedKeys(data: ProgressData, courseSlug: string): string[] {
  return data.completions[courseSlug] ?? [];
}

function isCourseComplete(data: ProgressData, courseSlug: string): boolean {
  const course = getCourse(courseSlug);
  if (!course) return false;
  const total = lessonCount(course);
  return (
    total > 0 &&
    completedKeys(data, courseSlug).length >= total &&
    Boolean(data.quiz[courseSlug]?.passed)
  );
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [synced, setSynced] = useState(false);
  const [traineeId, setTraineeId] = useState<string | null>(null);
  const [traineeEmail, setTraineeEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const ids = useRef<Ids>({ enrollment: {}, lesson: {} });
  const dataRef = useRef<ProgressData>(emptyProgress);
  const traineeRef = useRef<string | null>(null);

  const commit = useCallback((next: ProgressData) => {
    dataRef.current = next;
    setData(next);
    if (traineeRef.current) writeCache(traineeRef.current, next);
  }, []);

  // ---------------------------------------------------------------- server IO

  const logActivity = useCallback(
    async (
      client: DataClient,
      type: ActivityType,
      extra: { courseSlug?: string; detail?: string } = {}
    ) => {
      const traineeId = traineeRef.current;
      if (!traineeId) return;
      const occurredAt = new Date().toISOString();
      await client.models.ActivityEvent.create({
        traineeId,
        type,
        day: utcDay(occurredAt),
        occurredAt,
        ...extra,
      });
    },
    []
  );

  const ensureEnrollment = useCallback(
    async (client: DataClient, courseSlug: string): Promise<string> => {
      const known = ids.current.enrollment[courseSlug];
      if (known) return known;
      const traineeId = traineeRef.current;
      if (!traineeId) throw new Error("No trainee id");

      const course = getCourse(courseSlug);
      const now = new Date().toISOString();
      const created = unwrap(
        await client.models.Enrollment.create({
          traineeId,
          courseSlug,
          courseTitle: course?.title ?? courseSlug,
          status: "IN_PROGRESS",
          lessonsTotal: course ? lessonCount(course) : 0,
          lessonsCompleted: 0,
          percentComplete: 0,
          quizPassed: false,
          startedAt: now,
        })
      );
      if (!created?.id) throw new Error("Enrollment could not be created");
      ids.current.enrollment[courseSlug] = created.id;
      return created.id;
    },
    []
  );

  /** Push the rolled-up view of one course onto its Enrollment row. */
  const syncEnrollment = useCallback(
    async (client: DataClient, courseSlug: string, next: ProgressData) => {
      const enrollmentId = await ensureEnrollment(client, courseSlug);
      const course = getCourse(courseSlug);
      const total = course ? lessonCount(course) : 0;
      const done = completedKeys(next, courseSlug).length;
      const quiz = next.quiz[courseSlug];
      const complete = isCourseComplete(next, courseSlug);

      const before = unwrap(
        await client.models.Enrollment.get({ id: enrollmentId })
      );
      const wasComplete = before?.status === "COMPLETED";

      unwrap(
        await client.models.Enrollment.update({
          id: enrollmentId,
          lessonsCompleted: done,
          lessonsTotal: total,
          percentComplete: total === 0 ? 0 : Math.round((done / total) * 100),
          bestQuizPercent: quiz?.scorePercent,
          quizPassed: Boolean(quiz?.passed),
          status: complete ? "COMPLETED" : "IN_PROGRESS",
          completedAt: complete
            ? before?.completedAt ?? new Date().toISOString()
            : null,
        })
      );

      if (complete && !wasComplete) {
        await logActivity(client, "COURSE_COMPLETED", { courseSlug });
      }
    },
    [ensureEnrollment, logActivity]
  );

  const persistLesson = useCallback(
    async (
      client: DataClient,
      write: Extract<PendingWrite, { kind: "lesson" }>,
      next: ProgressData
    ) => {
      const { courseSlug, moduleSlug, lessonSlug, completed } = write;
      const idKey = `${courseSlug}|${lessonKey(moduleSlug, lessonSlug)}`;
      const existing = ids.current.lesson[idKey];

      if (completed && !existing) {
        const enrollmentId = await ensureEnrollment(client, courseSlug);
        const row = unwrap(
          await client.models.LessonCompletion.create({
            enrollmentId,
            traineeId: traineeRef.current!,
            courseSlug,
            moduleSlug,
            lessonSlug,
            completedAt: write.at,
          })
        );
        if (row?.id) ids.current.lesson[idKey] = row.id;
        await logActivity(client, "LESSON_COMPLETED", {
          courseSlug,
          detail: lessonKey(moduleSlug, lessonSlug),
        });
      } else if (!completed && existing) {
        unwrap(await client.models.LessonCompletion.delete({ id: existing }));
        delete ids.current.lesson[idKey];
      }

      await syncEnrollment(client, courseSlug, next);
    },
    [ensureEnrollment, logActivity, syncEnrollment]
  );

  const persistQuiz = useCallback(
    async (
      client: DataClient,
      write: Extract<PendingWrite, { kind: "quiz" }>,
      next: ProgressData
    ) => {
      const enrollmentId = await ensureEnrollment(client, write.courseSlug);
      unwrap(
        await client.models.QuizAttempt.create({
          enrollmentId,
          traineeId: traineeRef.current!,
          courseSlug: write.courseSlug,
          scorePercent: write.scorePercent,
          correctCount: write.correctCount,
          questionCount: write.questionCount,
          passed: write.passed,
          attemptedAt: write.at,
        })
      );
      await logActivity(client, "QUIZ_ATTEMPTED", {
        courseSlug: write.courseSlug,
        detail: `${write.scorePercent}%`,
      });
      await syncEnrollment(client, write.courseSlug, next);
    },
    [ensureEnrollment, logActivity, syncEnrollment]
  );

  const applyWrite = useCallback(
    async (client: DataClient, write: PendingWrite, next: ProgressData) => {
      if (write.kind === "lesson") {
        await persistLesson(client, write, next);
      } else {
        await persistQuiz(client, write, next);
      }
    },
    [persistLesson, persistQuiz]
  );

  const persist = useCallback(
    async (write: PendingWrite, next: ProgressData) => {
      const client = getDataClient();
      const traineeId = traineeRef.current;
      if (!traineeId) return;
      if (!client) {
        enqueue(traineeId, write);
        return;
      }
      try {
        await applyWrite(client, write, next);
      } catch {
        // Offline, or the backend rejected it — replay on the next sync.
        enqueue(traineeId, write);
        setSynced(false);
      }
    },
    [applyWrite]
  );

  const flushPending = useCallback(
    async (client: DataClient) => {
      const traineeId = traineeRef.current;
      if (!traineeId) return;
      const queue = readPending(traineeId);
      if (queue.length === 0) return;

      const remaining: PendingWrite[] = [];
      for (const write of queue) {
        try {
          await applyWrite(client, write, dataRef.current);
        } catch {
          remaining.push(write);
        }
      }
      writePending(traineeId, remaining);
    },
    [applyWrite]
  );

  /** Create the Trainee row on first sight; stamp last-seen on return. */
  const ensureTrainee = useCallback(
    async (
      client: DataClient,
      id: string,
      attributes: Record<string, string | undefined>,
      fallbackEmail: string
    ) => {
      const now = new Date().toISOString();
      const existing = unwrap(await client.models.Trainee.get({ id }));
      const sessionKey = `well-control-training:signin:${id}`;
      let firstThisSession = true;
      try {
        firstThisSession = window.sessionStorage.getItem(sessionKey) === null;
      } catch {
        // storage disabled — treat every load as a new session
      }

      if (!existing) {
        unwrap(
          await client.models.Trainee.create({
            id,
            email: attributes.email ?? fallbackEmail,
            displayName: attributes.name ?? attributes.preferred_username,
            company: attributes["custom:company"],
            jobTitle: attributes["custom:jobTitle"],
            signedUpAt: now,
            lastSeenAt: now,
            signInCount: 1,
          })
        );
        await logActivity(client, "SIGN_UP");
      } else if (firstThisSession) {
        unwrap(
          await client.models.Trainee.update({
            id,
            lastSeenAt: now,
            signInCount: (existing.signInCount ?? 0) + 1,
          })
        );
        await logActivity(client, "SIGN_IN");
      }

      if (firstThisSession) {
        try {
          window.sessionStorage.setItem(sessionKey, now);
        } catch {
          // ignore
        }
      }
    },
    [logActivity]
  );

  /** One-off import of pre-account localStorage progress (issue #5). */
  const migrateLegacyProgress = useCallback(
    async (client: DataClient) => {
      const slugs = courses.map((course) => course.slug);
      const legacy = readLegacyProgress(slugs);
      const hasLegacy =
        Object.keys(legacy.completions).length > 0 ||
        Object.keys(legacy.quiz).length > 0;
      if (!hasLegacy) return;

      let next = dataRef.current;
      for (const [courseSlug, keys] of Object.entries(legacy.completions)) {
        for (const key of keys) {
          if (completedKeys(next, courseSlug).includes(key)) continue;
          const [moduleSlug, lessonSlug] = key.split("/");
          if (!moduleSlug || !lessonSlug) continue;
          next = {
            ...next,
            completions: {
              ...next.completions,
              [courseSlug]: [...completedKeys(next, courseSlug), key],
            },
          };
          await persistLesson(
            client,
            {
              kind: "lesson",
              courseSlug,
              moduleSlug,
              lessonSlug,
              completed: true,
              at: new Date().toISOString(),
            },
            next
          );
        }
      }

      for (const [courseSlug, result] of Object.entries(legacy.quiz)) {
        if (next.quiz[courseSlug]) continue;
        next = { ...next, quiz: { ...next.quiz, [courseSlug]: result } };
        const questionCount = getCourse(courseSlug)?.quiz.questions.length ?? 0;
        await persistQuiz(
          client,
          {
            kind: "quiz",
            courseSlug,
            scorePercent: result.scorePercent,
            correctCount: Math.round(
              (result.scorePercent / 100) * questionCount
            ),
            questionCount,
            passed: result.passed,
            at: result.completedAt,
          },
          next
        );
      }

      commit(next);
      clearLegacyProgress(slugs);
    },
    [commit, persistLesson, persistQuiz]
  );

  // ------------------------------------------------------------------- load

  const load = useCallback(async () => {
    let user: Awaited<ReturnType<typeof getCurrentUser>>;
    try {
      user = await getCurrentUser();
    } catch {
      return; // not signed in
    }

    const id = user.userId;
    traineeRef.current = id;
    setTraineeId(id);

    // Seed from cache so the courseware is usable before the network answers.
    const cached = readCache(id);
    dataRef.current = cached;
    setData(cached);
    setLoaded(true);

    const client = getDataClient();
    if (!client) return;

    try {
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken?.payload?.["cognito:groups"];
      setIsAdmin(Array.isArray(groups) && groups.includes("admins"));

      const attributes = await fetchUserAttributes().catch(
        () => ({}) as Record<string, string | undefined>
      );
      const email = attributes.email ?? user.signInDetails?.loginId ?? "";
      setTraineeEmail(email);

      await ensureTrainee(client, id, attributes, email);

      const [enrollments, lessons, attempts] = await Promise.all([
        listAll((nextToken) => client.models.Enrollment.list({ nextToken })),
        listAll((nextToken) =>
          client.models.LessonCompletion.list({ nextToken })
        ),
        listAll((nextToken) => client.models.QuizAttempt.list({ nextToken })),
      ]);

      const server: ProgressData = { completions: {}, quiz: {} };
      const nextIds: Ids = { enrollment: {}, lesson: {} };

      for (const enrollment of enrollments) {
        if (enrollment.courseSlug && enrollment.id) {
          nextIds.enrollment[enrollment.courseSlug] = enrollment.id;
        }
      }
      for (const lesson of lessons) {
        if (!lesson.courseSlug || !lesson.moduleSlug || !lesson.lessonSlug) {
          continue;
        }
        const key = lessonKey(lesson.moduleSlug, lesson.lessonSlug);
        const list = (server.completions[lesson.courseSlug] ??= []);
        if (!list.includes(key)) list.push(key);
        if (lesson.id) nextIds.lesson[`${lesson.courseSlug}|${key}`] = lesson.id;
      }
      for (const attempt of attempts) {
        const best = server.quiz[attempt.courseSlug];
        if (!best || attempt.scorePercent > best.scorePercent) {
          server.quiz[attempt.courseSlug] = {
            scorePercent: attempt.scorePercent,
            passed: attempt.passed,
            completedAt: attempt.attemptedAt,
          };
        }
      }

      ids.current = nextIds;
      commit(server);
      setSynced(true);

      await flushPending(client);
      await migrateLegacyProgress(client);
    } catch {
      // Stay on cached data; writes queue until the next successful sync.
      setSynced(false);
    }
  }, [commit, ensureTrainee, flushPending, migrateLegacyProgress]);

  useEffect(() => {
    // `load` awaits the auth call before it touches state, so this is a
    // subscription to an external system rather than a cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  // Replay queued writes when the browser comes back online.
  useEffect(() => {
    function onOnline() {
      const client = getDataClient();
      if (!client) return;
      void flushPending(client).then(() => setSynced(true));
    }
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [flushPending]);

  // ---------------------------------------------------------------- mutations

  const setLessonCompleted = useCallback(
    (
      courseSlug: string,
      moduleSlug: string,
      lessonSlug: string,
      completed: boolean
    ) => {
      const key = lessonKey(moduleSlug, lessonSlug);
      const current = completedKeys(dataRef.current, courseSlug);
      const updated = completed
        ? current.includes(key)
          ? current
          : [...current, key]
        : current.filter((item) => item !== key);

      const next: ProgressData = {
        ...dataRef.current,
        completions: { ...dataRef.current.completions, [courseSlug]: updated },
      };
      commit(next);
      void persist(
        {
          kind: "lesson",
          courseSlug,
          moduleSlug,
          lessonSlug,
          completed,
          at: new Date().toISOString(),
        },
        next
      );
    },
    [commit, persist]
  );

  const recordQuizAttempt = useCallback(
    (courseSlug: string, attempt: QuizAttemptInput) => {
      const at = new Date().toISOString();
      const best = dataRef.current.quiz[courseSlug];
      const result: QuizResult =
        !best || attempt.scorePercent > best.scorePercent
          ? {
              scorePercent: attempt.scorePercent,
              passed: attempt.passed,
              completedAt: at,
            }
          : best;

      const next: ProgressData = {
        ...dataRef.current,
        quiz: { ...dataRef.current.quiz, [courseSlug]: result },
      };
      commit(next);
      void persist({ kind: "quiz", courseSlug, ...attempt, at }, next);
    },
    [commit, persist]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      loaded,
      synced,
      traineeId,
      traineeEmail,
      isAdmin,
      data,
      setLessonCompleted,
      recordQuizAttempt,
    }),
    [
      loaded,
      synced,
      traineeId,
      traineeEmail,
      isAdmin,
      data,
      setLessonCompleted,
      recordQuizAttempt,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgressContext must be used inside ProgressProvider");
  }
  return context;
}
