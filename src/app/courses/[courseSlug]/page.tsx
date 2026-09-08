import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <Link
        href="/courses"
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
      >
        &larr; All courses
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        {course.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        {course.description}
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {course.modules.map((courseModule, moduleIndex) => (
          <div key={courseModule.slug}>
            <h2 className="font-serif text-lg font-semibold text-brand-navy">
              Module {moduleIndex + 1}: {courseModule.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {courseModule.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/courses/${course.slug}/${courseModule.slug}/${lesson.slug}`}
                    className="flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-white px-4 py-3 transition-colors hover:border-brand-teal hover:shadow-sm"
                  >
                    <span className="text-sm font-medium text-brand-navy">
                      {lessonIndex + 1}. {lesson.title}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {lesson.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
