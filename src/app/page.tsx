import Link from "next/link";
import { courses } from "@/lib/courses";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      <section className="flex flex-col gap-6">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
          Training and knowledge sharing for well control professionals.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Structured courses covering well control fundamentals, wild well
          response, and field readiness &mdash; built for people preparing for
          safety-critical roles in the field.
        </p>
        <div>
          <Link
            href="/courses"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Browse courses
          </Link>
        </div>
      </section>

      <section id="courses" className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Courses
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="rounded-lg border border-black/[.08] bg-white p-6 transition-colors hover:border-black/20 dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/30"
            >
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                {course.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {course.description}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                {course.modules.length} modules &middot;{" "}
                {course.modules.reduce((n, m) => n + m.lessons.length, 0)}{" "}
                lessons
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
