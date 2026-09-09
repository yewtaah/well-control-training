"use client";

import { useCallback, useMemo } from "react";
import {
  useProgressContext,
  type QuizAttemptInput,
} from "@/components/ProgressProvider";
import type { QuizResult } from "@/lib/progressCache";

export type { QuizResult };

/**
 * Per-course view of the signed-in learner's progress. The data lives on their
 * account (Amplify Data), with a local mirror so the courseware keeps working
 * offline — see ProgressProvider.
 */
export function useProgress(courseSlug: string) {
  const {
    data,
    loaded,
    synced,
    setLessonCompleted,
    recordQuizAttempt,
  } = useProgressContext();

  const completed = useMemo(
    () => new Set(data.completions[courseSlug] ?? []),
    [data.completions, courseSlug]
  );

  const quizResult = data.quiz[courseSlug] ?? null;

  const isComplete = useCallback(
    (key: string) => completed.has(key),
    [completed]
  );

  const toggleComplete = useCallback(
    (key: string) => {
      const [moduleSlug, lessonSlug] = key.split("/");
      if (!moduleSlug || !lessonSlug) return;
      setLessonCompleted(
        courseSlug,
        moduleSlug,
        lessonSlug,
        !completed.has(key)
      );
    },
    [completed, courseSlug, setLessonCompleted]
  );

  const recordQuizResult = useCallback(
    (attempt: QuizAttemptInput) => recordQuizAttempt(courseSlug, attempt),
    [courseSlug, recordQuizAttempt]
  );

  return {
    completed,
    loaded,
    synced,
    isComplete,
    toggleComplete,
    quizResult,
    recordQuizResult,
  };
}

/** Progress across the whole programme, for dashboards and certificates. */
export function useProgramProgress() {
  const { data, loaded, synced } = useProgressContext();
  return { data, loaded, synced };
}
