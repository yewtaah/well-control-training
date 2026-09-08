import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessonsInOrder, courses, getLesson } from "@/lib/courses";
import { LessonComplete } from "./LessonComplete";

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.modules.flatMap((courseModule) =>
      courseModule.lessons.map((lesson) => ({
        courseSlug: course.slug,
        moduleSlug: courseModule.slug,
        lessonSlug: lesson.slug,
      }))
    )
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const found = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!found) notFound();
  const { course, courseModule, lesson } = found;

  const order = allLessonsInOrder(course);
  const index = order.findIndex(
    (entry) =>
      entry.courseModule.slug === moduleSlug && entry.lesson.slug === lessonSlug
  );
  const prev = index > 0 ? order[index - 1] : undefined;
  const next = index < order.length - 1 ? order[index + 1] : undefined;
  const lessonKey = `${moduleSlug}/${lessonSlug}`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-zinc-50"
      >
        &larr; {course.title}
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {courseModule.title}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {lesson.title}
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        {lesson.content}
      </p>

      <div className="mt-10">
        <LessonComplete courseSlug={course.slug} lessonKey={lessonKey} />
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-black/[.08] pt-6 dark:border-white/[.145]">
        {prev ? (
          <Link
            href={`/courses/${course.slug}/${prev.courseModule.slug}/${prev.lesson.slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            &larr; {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/${next.courseModule.slug}/${next.lesson.slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {next.lesson.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
