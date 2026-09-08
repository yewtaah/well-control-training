import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/curriculum";
import { Certificate } from "./Certificate";

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
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy print:hidden"
      >
        &larr; {course.title}
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy print:hidden">
        Certificate
      </h1>
      <div className="mt-8">
        <Certificate course={course} />
      </div>
    </main>
  );
}
