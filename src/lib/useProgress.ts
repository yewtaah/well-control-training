"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Progress is held in localStorage for now, so it is per-browser rather than
 * per-account. Issue #5 moves this onto Amplify Data.
 */

function progressKey(courseSlug: string) {
  return `well-control-training:progress:${courseSlug}`;
}

function quizKey(courseSlug: string) {
  return `well-control-training:quiz:${courseSlug}`;
}

export type QuizResult = {
  scorePercent: number;
  passed: boolean;
  completedAt: string;
};

function readCompleted(courseSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(progressKey(courseSlug));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function readQuizResult(courseSlug: string): QuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(quizKey(courseSlug));
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function notify() {
  window.dispatchEvent(new StorageEvent("storage"));
}

export function useProgress(courseSlug: string) {
  const completedList = useSyncExternalStore(
    subscribe,
    () => readCompleted(courseSlug).join(","),
    () => ""
  );
  const quizJson = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(quizKey(courseSlug)) ?? "";
      } catch {
        return "";
      }
    },
    () => ""
  );
  const loaded = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const completed = useMemo(
    () => new Set(completedList ? completedList.split(",") : []),
    [completedList]
  );

  const quizResult = useMemo<QuizResult | null>(() => {
    if (!quizJson) return null;
    try {
      return JSON.parse(quizJson) as QuizResult;
    } catch {
      return null;
    }
  }, [quizJson]);

  const isComplete = useCallback((key: string) => completed.has(key), [
    completed,
  ]);

  const toggleComplete = useCallback(
    (key: string) => {
      const current = new Set(readCompleted(courseSlug));
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      try {
        window.localStorage.setItem(
          progressKey(courseSlug),
          JSON.stringify([...current])
        );
      } catch {
        // ignore write failures (private browsing, storage disabled)
      }
      notify();
    },
    [courseSlug]
  );

  const recordQuizResult = useCallback(
    (result: QuizResult) => {
      const previous = readQuizResult(courseSlug);
      // Keep the learner's best attempt.
      if (!previous || result.scorePercent > previous.scorePercent) {
        try {
          window.localStorage.setItem(
            quizKey(courseSlug),
            JSON.stringify(result)
          );
        } catch {
          // ignore write failures
        }
      }
      notify();
    },
    [courseSlug]
  );

  return {
    completed,
    loaded,
    isComplete,
    toggleComplete,
    quizResult,
    recordQuizResult,
  };
}
