"use client";

/**
 * Local mirror of the learner's server-side progress. It seeds the UI before
 * the first network round-trip and keeps the courseware usable offline; writes
 * that fail are queued here and replayed on the next load or reconnect.
 */

export type QuizResult = {
  scorePercent: number;
  passed: boolean;
  completedAt: string;
};

export type ProgressData = {
  /** courseSlug -> `moduleSlug/lessonSlug` keys the learner has completed. */
  completions: Record<string, string[]>;
  /** courseSlug -> best attempt. */
  quiz: Record<string, QuizResult>;
};

export type PendingWrite =
  | {
      kind: "lesson";
      courseSlug: string;
      moduleSlug: string;
      lessonSlug: string;
      completed: boolean;
      at: string;
    }
  | {
      kind: "quiz";
      courseSlug: string;
      scorePercent: number;
      correctCount: number;
      questionCount: number;
      passed: boolean;
      at: string;
    };

const VERSION = "v2";

function key(traineeId: string, suffix: string) {
  return `well-control-training:${VERSION}:${traineeId}:${suffix}`;
}

export const emptyProgress: ProgressData = { completions: {}, quiz: {} };

export function readCache(traineeId: string): ProgressData {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(key(traineeId, "progress"));
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      completions: parsed.completions ?? {},
      quiz: parsed.quiz ?? {},
    };
  } catch {
    return emptyProgress;
  }
}

export function writeCache(traineeId: string, data: ProgressData) {
  try {
    window.localStorage.setItem(key(traineeId, "progress"), JSON.stringify(data));
  } catch {
    // Private browsing or storage disabled — the server copy is authoritative.
  }
}

export function readPending(traineeId: string): PendingWrite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(traineeId, "pending"));
    return raw ? (JSON.parse(raw) as PendingWrite[]) : [];
  } catch {
    return [];
  }
}

export function writePending(traineeId: string, queue: PendingWrite[]) {
  try {
    window.localStorage.setItem(key(traineeId, "pending"), JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export function enqueue(traineeId: string, write: PendingWrite) {
  const queue = readPending(traineeId).filter((item) =>
    // A later write for the same lesson supersedes an earlier one.
    write.kind === "lesson" && item.kind === "lesson"
      ? !(
          item.courseSlug === write.courseSlug &&
          item.moduleSlug === write.moduleSlug &&
          item.lessonSlug === write.lessonSlug
        )
      : true
  );
  queue.push(write);
  writePending(traineeId, queue);
}

/**
 * Progress from before accounts were wired up (issue #5) lived under a
 * per-browser key. Fold anything still there into the account's data once.
 */
export function readLegacyProgress(courseSlugs: string[]): ProgressData {
  const data: ProgressData = { completions: {}, quiz: {} };
  if (typeof window === "undefined") return data;
  for (const slug of courseSlugs) {
    try {
      const lessons = window.localStorage.getItem(
        `well-control-training:progress:${slug}`
      );
      if (lessons) {
        const parsed = JSON.parse(lessons) as string[];
        if (parsed.length > 0) data.completions[slug] = parsed;
      }
      const quiz = window.localStorage.getItem(
        `well-control-training:quiz:${slug}`
      );
      if (quiz) data.quiz[slug] = JSON.parse(quiz) as QuizResult;
    } catch {
      // skip anything unparseable
    }
  }
  return data;
}

export function clearLegacyProgress(courseSlugs: string[]) {
  for (const slug of courseSlugs) {
    try {
      window.localStorage.removeItem(`well-control-training:progress:${slug}`);
      window.localStorage.removeItem(`well-control-training:quiz:${slug}`);
    } catch {
      // ignore
    }
  }
}
