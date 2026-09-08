"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useProgress } from "@/lib/ProgressProvider";
import { lessonCount, type Course } from "@/lib/curriculum";

/**
 * A short, stable reference derived from the learner and the course, so the
 * same completion always prints the same number.
 */
function reference(seed: string): string {
  let hash = 0;
  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return `WCA-${hash.toString(36).toUpperCase().padStart(7, "0").slice(0, 7)}`;
}

export function Certificate({ course }: { course: Course }) {
  const { completed, quizResult, loaded } = useProgress(course.slug);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    void (async () => {
      try {
        const user = await getCurrentUser();
        const attributes: Record<string, string | undefined> =
          await fetchUserAttributes().catch(() => ({}));
        setName(
          attributes.preferred_username ??
            attributes.email ??
            user.signInDetails?.loginId ??
            ""
        );
      } catch {
        setName("");
      }
    })();
  }, []);

  const total = lessonCount(course);
  const allLessonsDone = completed.size >= total;
  const passed = quizResult?.passed ?? false;
  const earned = allLessonsDone && passed;

  if (!loaded) {
    return <p className="text-sm text-zinc-500">Checking your progress&hellip;</p>;
  }

  if (!earned) {
    return (
      <div className="rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Not yet earned
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          A certificate is issued once every lesson is complete and the
          knowledge check is passed.
        </p>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-zinc-700">
          <li className="flex items-center gap-2">
            <span aria-hidden>{allLessonsDone ? "✓" : "○"}</span>
            <span>
              Lessons complete &mdash; {completed.size} of {total}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden>{passed ? "✓" : "○"}</span>
            <span>
              Knowledge check passed
              {quizResult ? ` — best score ${quizResult.scorePercent}%` : ""}
            </span>
          </li>
        </ul>
        <Link
          href={`/courses/${course.slug}`}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
        >
          Back to the course
        </Link>
      </div>
    );
  }

  const issued = new Date();

  return (
    <div className="flex flex-col gap-6">
      <div className="print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
        >
          Print or save as PDF
        </button>
      </div>

      <article className="certificate rounded-lg border-4 border-brand-navy bg-white p-8 text-center sm:p-12">
        <Image
          src="/logo.png"
          alt="WellCommand Assurance"
          width={88}
          height={88}
          className="mx-auto rounded-full"
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/70">
          Certificate of Completion
        </p>
        <p className="mt-8 text-sm text-zinc-600">This certifies that</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-brand-navy">
          {name || "Trainee"}
        </p>
        <p className="mt-6 text-sm text-zinc-600">
          has completed all {total} lessons and passed the knowledge check for
        </p>
        <p className="mt-2 font-serif text-2xl font-semibold text-brand-navy">
          {course.title}
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          Course {course.order} of the Well Command WC Training programme
          &middot; {course.estimatedMinutes} minutes
        </p>

        <div className="mx-auto mt-10 h-px w-40 bg-brand-gold" />

        <div className="mt-6 flex flex-col items-center gap-1 text-xs text-zinc-500">
          <p>Issued {issued.toLocaleDateString()}</p>
          <p>
            Reference {reference(`${name}|${course.slug}`)} &middot; Score{" "}
            {quizResult?.scorePercent}%
          </p>
          <p className="mt-2 font-medium text-brand-navy">
            WellCommand Assurance
          </p>
        </div>
      </article>
    </div>
  );
}
