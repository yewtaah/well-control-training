import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/curriculum";
import { KnowledgeCheck } from "./KnowledgeCheck";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function KnowledgeCheckPage({
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
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
      >
        &larr; {course.title}
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Knowledge check
      </h1>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        {course.quiz.questions.length} questions covering {course.title}. You
        need {course.quiz.passPercent}% to pass, and you can retake it as often
        as you like.
      </p>

      <div className="mt-10">
        <KnowledgeCheck
          courseSlug={course.slug}
          courseTitle={course.title}
          quiz={course.quiz}
        />
      </div>
    </main>
  );
}
