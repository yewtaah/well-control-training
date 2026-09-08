import Link from "next/link";
import { CourseProgressBar } from "@/components/CourseProgressBar";
import { courses, lessonCount, program, programMinutes } from "@/lib/curriculum";

export default function Home() {
  const first = courses[0];
  const totalHours = Math.round((programMinutes() / 60) * 10) / 10;

  return (
    <>
      <section className="bg-brand-navy px-6 py-20 sm:py-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            WellCommand Assurance
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {program.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/80">
            {program.audience}
          </p>
          <p className="max-w-3xl text-base leading-7 text-white/70">
            {program.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/courses/${first.slug}`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-6 text-base font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
            >
              Start here &mdash; {first.title}
            </Link>
            <p className="text-sm text-white/60">
              {courses.length} courses &middot; 30&ndash;40 minutes each &middot;
              about {totalHours} hours total
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section aria-labelledby="objective">
          <h2
            id="objective"
            className="font-serif text-2xl font-semibold tracking-tight text-brand-navy"
          >
            Training objective
          </h2>
          <p className="mt-4 max-w-3xl border-l-2 border-brand-gold pl-5 text-base leading-7 text-zinc-700">
            {program.objective}
          </p>
        </section>

        <section className="mt-16" aria-labelledby="curriculum">
          <h2
            id="curriculum"
            className="font-serif text-2xl font-semibold tracking-tight text-brand-navy"
          >
            Curriculum
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Twelve courses, taken in order. Each is sized for a single 30&ndash;40
            minute sitting and ends with a knowledge check.
          </p>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {courses.map((course) => {
              const total = lessonCount(course);
              return (
                <li key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex h-full flex-col gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-5 transition-colors hover:border-brand-gold hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                        {course.order}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-brand-navy/70">
                        {course.estimatedMinutes} min
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold leading-snug text-brand-navy">
                      {course.title}
                    </h3>
                    <p className="text-sm leading-6 text-zinc-600">
                      {course.description}
                    </p>
                    <div className="mt-auto pt-2">
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
        </section>

        <section className="mt-16" aria-labelledby="simulator">
          <div className="rounded-lg border border-[var(--brand-border)] bg-brand-navy p-8">
            <h2
              id="simulator"
              className="font-serif text-2xl font-semibold tracking-tight text-white"
            >
              Hands-on simulator practice
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
              Theory tells you to hold bottomhole pressure constant. The choke
              drill is where you find out how hard that is with a gauge that
              lags behind every adjustment you make.
            </p>
            <Link
              href="/simulator"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
            >
              Open the choke drill
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
