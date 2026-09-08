import Link from "next/link";
import { courses } from "@/lib/courses";

export const metadata = {
  title: "Courses | Well Control Training",
};

export default function CoursesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Courses
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="rounded-lg border border-[var(--brand-border)] bg-white p-6 transition-colors hover:border-brand-teal hover:shadow-sm"
          >
            <h2 className="font-serif text-lg font-semibold text-brand-navy">
              {course.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {course.description}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand-teal">
              {course.modules.length} modules &middot;{" "}
              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
