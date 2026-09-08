"use client";

import { useProgress } from "@/lib/ProgressProvider";

export function CourseProgressBar({
  courseSlug,
  totalLessons,
}: {
  courseSlug: string;
  totalLessons: number;
}) {
  const { completed, loaded, quizResult } = useProgress(courseSlug);

  const done = loaded ? completed.size : 0;
  const percent = totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course progress"
      >
        <div
          className="h-full rounded-full bg-brand-gold transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        {done} of {totalLessons} lessons
        {quizResult?.passed ? (
          <span className="text-emerald-700">
            {" "}
            &middot; knowledge check passed
          </span>
        ) : null}
      </p>
    </div>
  );
}
