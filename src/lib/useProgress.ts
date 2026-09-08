"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

function storageKey(courseSlug: string) {
  return `well-control-training:progress:${courseSlug}`;
}

function readCompleted(courseSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(courseSlug));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function useProgress(courseSlug: string) {
  const completedList = useSyncExternalStore(
    subscribe,
    () => readCompleted(courseSlug).join(","),
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

  const isComplete = useCallback(
    (lessonKey: string) => completed.has(lessonKey),
    [completed]
  );

  const toggleComplete = useCallback(
    (lessonKey: string) => {
      const current = new Set(readCompleted(courseSlug));
      if (current.has(lessonKey)) {
        current.delete(lessonKey);
      } else {
        current.add(lessonKey);
      }
      try {
        window.localStorage.setItem(
          storageKey(courseSlug),
          JSON.stringify([...current])
        );
      } catch {
        // ignore write failures (private browsing, storage disabled)
      }
      window.dispatchEvent(new StorageEvent("storage"));
    },
    [courseSlug]
  );

  return { completed, loaded, isComplete, toggleComplete };
}
