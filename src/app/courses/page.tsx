import Link from "next/link";
import { courses } from "@/lib/courses";

export const metadata = {
  title: "Courses | Well Control Training",
};

export default function CoursesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Courses
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="rounded-lg border border-black/[.08] bg-white p-6 transition-colors hover:border-black/20 dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/30"
          >
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              {course.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {course.description}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {course.modules.length} modules &middot;{" "}
              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
