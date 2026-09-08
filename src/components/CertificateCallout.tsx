"use client";

import Link from "next/link";
import { useProgressContext } from "@/components/ProgressProvider";
import { courseCompletion, programmeCompletion } from "@/lib/certificate";

function Callout({
  earned,
  href,
  earnedLabel,
  pendingLabel,
}: {
  earned: boolean;
  href: string;
  earnedLabel: string;
  pendingLabel: string;
}) {
  if (!earned) {
    return <p className="text-sm text-zinc-500">{pendingLabel}</p>;
  }
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
    >
      {earnedLabel}
    </Link>
  );
}

export function CourseCertificateCallout({
  courseSlug,
}: {
  courseSlug: string;
}) {
  const { data, loaded } = useProgressContext();
  if (!loaded) return null;
  const completion = courseCompletion(data, courseSlug);

  return (
    <Callout
      earned={completion.complete}
      href={`/courses/${courseSlug}/certificate`}
      earnedLabel="View your certificate"
      pendingLabel="Finish every lesson and pass the knowledge check to earn this course's certificate."
    />
  );
}

export function ProgrammeCertificateCallout() {
  const { data, loaded } = useProgressContext();
  if (!loaded) return null;
  const completion = programmeCompletion(data);

  return (
    <Callout
      earned={completion.complete}
      href="/certificate"
      earnedLabel="View your programme certificate"
      pendingLabel={`${completion.coursesCompleted} of ${completion.coursesTotal} courses complete — finish all ${completion.coursesTotal} to earn the programme certificate.`}
    />
  );
}
