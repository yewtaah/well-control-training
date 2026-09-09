import Link from "next/link";
import { ProgrammeCertificateCallout } from "@/components/CertificateCallout";
import { CourseProgressBar } from "@/components/CourseProgressBar";
import { courses, lessonCount, program } from "@/lib/curriculum";

export const metadata = {
  title: "Curriculum | Well Command WC Training",
};

export default function CoursesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Curriculum
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        {program.title} &mdash; {courses.length} courses taken in order, each
        sized for a single 30&ndash;40 minute sitting.
      </p>

      <ol className="mt-10 flex flex-col gap-3">
        {courses.map((course) => {
          const total = lessonCount(course);
          return (
            <li key={course.slug}>
              <Link
                href={`/courses/${course.slug}`}
                className="flex flex-col gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-5 transition-colors hover:border-brand-gold hover:shadow-sm sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                  {course.order}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-lg font-semibold text-brand-navy">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {course.description}
                  </p>
                </div>
                <div className="w-full shrink-0 sm:w-48">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-brand-navy/60">
                    {course.estimatedMinutes} min &middot; {total} lessons
                  </p>
                  <CourseProgressBar
                    courseSlug={course.slug}
                    totalLessons={total}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="mt-10 rounded-lg border border-[var(--brand-border)] bg-zinc-50 p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Programme certificate
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Complete all {courses.length} courses and pass every knowledge check to
          earn a certificate for the full programme.
        </p>
        <div className="mt-4">
          <ProgrammeCertificateCallout />
        </div>
      </section>
    </main>
  );
}
