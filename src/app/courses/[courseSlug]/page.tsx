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
        className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-zinc-50"
      >
        &larr; All courses
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {course.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        {course.description}
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {course.modules.map((courseModule, moduleIndex) => (
          <div key={courseModule.slug}>
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Module {moduleIndex + 1}: {courseModule.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {courseModule.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/courses/${course.slug}/${courseModule.slug}/${lesson.slug}`}
                    className="flex items-center justify-between rounded-lg border border-black/[.08] bg-white px-4 py-3 transition-colors hover:border-black/20 dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/30"
                  >
                    <span className="text-sm font-medium text-black dark:text-zinc-50">
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
