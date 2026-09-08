import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessonsInOrder, courses, getLesson } from "@/lib/curriculum";
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
  const isLast = index === order.length - 1;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
      >
        &larr; {course.title}
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand-navy/70">
        {courseModule.title} &middot; lesson {index + 1} of {order.length}
      </p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        {lesson.title}
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600">{lesson.content}</p>

      <div className="mt-10">
        <LessonComplete
          courseSlug={course.slug}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
        />
      </div>

      {isLast ? (
        <div className="mt-10 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
          <h2 className="font-serif text-lg font-semibold text-brand-navy">
            That is the last lesson in this course
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Finish with the knowledge check &mdash;{" "}
            {course.quiz.questions.length} questions, {course.quiz.passPercent}%
            to pass.
          </p>
          <Link
            href={`/courses/${course.slug}/knowledge-check`}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
          >
            Take the knowledge check
          </Link>
        </div>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--brand-border)] pt-6">
        {prev ? (
          <Link
            href={`/courses/${course.slug}/${prev.courseModule.slug}/${prev.lesson.slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-brand-navy"
          >
            &larr; {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/${next.courseModule.slug}/${next.lesson.slug}`}
            className="text-right text-sm font-medium text-zinc-600 hover:text-brand-navy"
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
