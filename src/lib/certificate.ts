import { courses, getCourse, lessonCount } from "@/lib/curriculum";
import type { ProgressData } from "@/lib/progressCache";

/**
 * Certificate references are derived rather than stored: the same learner and
 * course always produce the same reference, on any device, without a round-trip.
 */
export function certificateRef(traineeId: string, scope: string): string {
  let hash = 2166136261;
  for (const char of `${traineeId}:${scope}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const digest = (hash >>> 0).toString(36).toUpperCase().padStart(7, "0");
  const prefix = scope === "programme" ? "WCA-PROG" : "WCA";
  return `${prefix}-${digest}`;
}

export type CourseCompletion = {
  /** Lessons ticked off, out of the course total. */
  lessonsCompleted: number;
  lessonsTotal: number;
  quizPercent: number | null;
  quizPassed: boolean;
  complete: boolean;
  /** When the last requirement was met — the date printed on the certificate. */
  completedAt: string | null;
};

export function courseCompletion(
  data: ProgressData,
  courseSlug: string
): CourseCompletion {
  const course = getCourse(courseSlug);
  const lessonsTotal = course ? lessonCount(course) : 0;
  const lessonsCompleted = (data.completions[courseSlug] ?? []).length;
  const quiz = data.quiz[courseSlug] ?? null;
  const complete =
    lessonsTotal > 0 && lessonsCompleted >= lessonsTotal && Boolean(quiz?.passed);

  return {
    lessonsCompleted,
    lessonsTotal,
    quizPercent: quiz?.scorePercent ?? null,
    quizPassed: Boolean(quiz?.passed),
    complete,
    completedAt: complete ? quiz?.completedAt ?? null : null,
  };
}

export type ProgrammeCompletion = {
  coursesCompleted: number;
  coursesTotal: number;
  complete: boolean;
  completedAt: string | null;
};

export function programmeCompletion(data: ProgressData): ProgrammeCompletion {
  const perCourse = courses.map((course) =>
    courseCompletion(data, course.slug)
  );
  const done = perCourse.filter((entry) => entry.complete);
  const complete = done.length === courses.length && courses.length > 0;
  const dates = done
    .map((entry) => entry.completedAt)
    .filter((date): date is string => Boolean(date))
    .sort();

  return {
    coursesCompleted: done.length,
    coursesTotal: courses.length,
    complete,
    completedAt: complete ? dates[dates.length - 1] ?? null : null,
  };
}

export function formatCertificateDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
