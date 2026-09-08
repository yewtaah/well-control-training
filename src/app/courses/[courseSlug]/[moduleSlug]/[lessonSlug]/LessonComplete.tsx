"use client";

import { useProgress } from "@/lib/ProgressProvider";
import { lessonKey } from "@/lib/curriculum";

export function LessonComplete({
  courseSlug,
  moduleSlug,
  lessonSlug,
}: {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const { loaded, isComplete, toggleComplete } = useProgress(courseSlug);

  const complete = isComplete(lessonKey(moduleSlug, lessonSlug));

  return (
    <button
      type="button"
      disabled={!loaded}
      aria-pressed={complete}
      onClick={() => toggleComplete(moduleSlug, lessonSlug)}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${
        complete
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-brand-gold text-brand-navy hover:bg-brand-gold-dark"
      }`}
    >
      {complete ? "Completed ✓" : "Mark lesson complete"}
    </button>
  );
}
