import Link from "next/link";
import { courses } from "@/lib/courses";

export default function Home() {
  return (
    <>
      <section className="bg-brand-navy px-6 py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            WellCommand Assurance
          </p>
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Training and knowledge sharing for well control professionals.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-white/70">
            Structured courses covering well control fundamentals, wild well
            response, and field readiness &mdash; built for people preparing
            for safety-critical roles in the field.
          </p>
          <div>
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-6 text-base font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section id="courses">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-navy">
            Courses
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="rounded-lg border border-[var(--brand-border)] bg-white p-6 transition-colors hover:border-brand-gold hover:shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold text-brand-navy">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {course.description}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand-navy/70">
                  {course.modules.length} modules &middot;{" "}
                  {course.modules.reduce((n, m) => n + m.lessons.length, 0)}{" "}
                  lessons
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
