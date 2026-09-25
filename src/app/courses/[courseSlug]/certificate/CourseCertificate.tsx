"use client";

import { Certificate } from "@/components/Certificate";
import { useProgressContext } from "@/components/ProgressProvider";
import { courseCompletion } from "@/lib/certificate";

export function CourseCertificate({
  courseSlug,
  courseTitle,
  courseOrder,
  courseCount,
  passPercent,
}: {
  courseSlug: string;
  courseTitle: string;
  courseOrder: number;
  courseCount: number;
  passPercent: number;
}) {
  const { data } = useProgressContext();
  const completion = courseCompletion(data, courseSlug);

  const outstanding: string[] = [];
  if (completion.lessonsCompleted < completion.lessonsTotal) {
    outstanding.push(
      `Complete the remaining ${
        completion.lessonsTotal - completion.lessonsCompleted
      } of ${completion.lessonsTotal} lessons.`
    );
  }
  if (!completion.quizPassed) {
    outstanding.push(
      completion.quizPercent === null
        ? `Pass the knowledge check (${passPercent}% to pass).`
        : `Pass the knowledge check — best attempt so far is ${completion.quizPercent}%, ${passPercent}% is needed.`
    );
  }

  return (
    <Certificate
      scope={courseSlug}
      title={courseTitle}
      subtitle={`Course ${courseOrder} of ${courseCount} · ${completion.lessonsTotal} lessons`}
      statement={`has completed every lesson in this course and passed the knowledge check with ${completion.quizPercent}%, meeting the Well Command  Assurance standard for`}
      earned={completion.complete}
      completedAt={completion.completedAt}
      outstanding={outstanding}
      backHref={`/courses/${courseSlug}`}
      backLabel={courseTitle}
    />
  );
}
