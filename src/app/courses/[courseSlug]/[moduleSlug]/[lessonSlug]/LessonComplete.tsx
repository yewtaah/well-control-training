"use client";

import { useProgress } from "@/lib/useProgress";

export function LessonComplete({
  courseSlug,
  lessonKey,
}: {
  courseSlug: string;
  lessonKey: string;
}) {
  const { loaded, isComplete, toggleComplete } = useProgress(courseSlug);

  if (!loaded) return null;

  const complete = isComplete(lessonKey);

  return (
    <button
      type="button"
      onClick={() => toggleComplete(lessonKey)}
      aria-pressed={complete}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${
        complete
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-brand-gold text-brand-navy hover:bg-brand-gold-dark"
      }`}
    >
      {complete ? (
        <>
          <span aria-hidden className="mr-2">
            ✓
          </span>
          Completed
        </>
      ) : (
        "Mark lesson complete"
      )}
    </button>
  );
}
