import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/curriculum";
import { CourseCertificate } from "./CourseCertificate";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <CourseCertificate
      courseSlug={course.slug}
      courseTitle={course.title}
      courseOrder={course.order}
      courseCount={courses.length}
      passPercent={course.quiz.passPercent}
    />
  );
}
