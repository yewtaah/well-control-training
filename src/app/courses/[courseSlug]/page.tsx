import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCertificateCallout } from "@/components/CertificateCallout";
import { CourseProgressBar } from "@/components/CourseProgressBar";
import { courses, getCourse, lessonCount } from "@/lib/curriculum";

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

  const total = lessonCount(course);
  const prerequisites = course.prerequisites
    .map((slug) => getCourse(slug))
    .filter((c) => c !== undefined);
  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link
        href="/courses"
        className="text-sm font-medium text-zinc-500 hover:text-brand-navy"
      >
        &larr; Curriculum
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Course {course.order} of {courses.length}
        </span>
        <span className="rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs font-medium text-brand-navy/70">
          {course.estimatedMinutes} min &middot; {total} lessons
        </span>
        {course.status === "draft" ? (
          <span className="rounded-full border border-brand-gold bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-navy">
            Draft &mdash; awaiting final content
          </span>
        ) : null}
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        {course.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        {course.description}
      </p>

      <div className="mt-6 max-w-md">
        <CourseProgressBar courseSlug={course.slug} totalLessons={total} />
      </div>

      <section className="mt-10 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          What you will be able to do
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {course.objectives.map((objective) => (
            <li
              key={objective}
              className="flex gap-3 text-sm leading-6 text-zinc-700"
            >
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
              {objective}
            </li>
          ))}
        </ul>

        {prerequisites.length > 0 ? (
          <p className="mt-5 text-sm text-zinc-600">
            <span className="font-medium text-brand-navy">Before this course:</span>{" "}
            {prerequisites.map((prerequisite, index) => (
              <span key={prerequisite.slug}>
                {index > 0 ? ", " : ""}
                <Link
                  href={`/courses/${prerequisite.slug}`}
                  className="underline underline-offset-2 hover:text-brand-navy"
                >
                  {prerequisite.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </section>

      {firstLesson ? (
        <div className="mt-8">
          <Link
            href={`/courses/${course.slug}/${course.modules[0].slug}/${firstLesson.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
          >
            Start course
          </Link>
        </div>
      ) : null}

      <div className="mt-12 flex flex-col gap-8">
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
                    className="flex flex-col gap-1 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-3 transition-colors hover:border-brand-gold hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span className="text-sm font-medium text-brand-navy">
                      {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
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

      <section className="mt-12 rounded-lg border border-[var(--brand-border)] bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Knowledge check
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {course.quiz.questions.length} questions. You need{" "}
          {course.quiz.passPercent}% to pass, and you can retake it as often as
          you like.
        </p>
        <Link
          href={`/courses/${course.slug}/knowledge-check`}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-brand-navy px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          Take the knowledge check
        </Link>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Certificate
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          A printable completion record, issued in your name with a reference
          tied to your account.
        </p>
        <div className="mt-4">
          <CourseCertificateCallout courseSlug={course.slug} />
        </div>
      </section>
    </main>
  );
}
