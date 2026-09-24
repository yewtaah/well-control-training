"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDataClient, utcDay } from "@/lib/amplifyClient";
import { courses } from "@/lib/curriculum";

type Enrollment = {
  courseSlug: string;
  courseTitle: string;
  status: string;
  percentComplete?: number | null;
  quizPassed?: boolean | null;
  dueAt?: string | null;
  traineeId: string;
};

type ActivityEvent = {
  id: string;
  traineeId: string;
  type: string;
  day: string;
  courseSlug?: string | null;
  detail?: string | null;
  occurredAt: string;
};

type Trainee = {
  id: string;
  email: string;
  displayName?: string | null;
  company?: string | null;
  role?: string | null;
  signedUpAt: string;
  lastSeenAt?: string | null;
};

type Dashboard = {
  trainees: Trainee[];
  enrollments: Enrollment[];
  events: ActivityEvent[];
  days: string[];
};

/** The seven UTC days ending today, oldest first. */
function lastSevenDays(): string[] {
  const days: string[] = [];
  const now = Date.now();
  for (let offset = 6; offset >= 0; offset -= 1) {
    days.push(utcDay(new Date(now - offset * 86_400_000).toISOString()));
  }
  return days;
}

function weekdayLabel(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Tallest a bar in the seven-day chart can draw. */
const BAR_MAX_PX = 120;

const ACTIVITY_LABELS: Record<string, string> = {
  SIGN_UP: "signed up",
  SIGN_IN: "signed in",
  LESSON_COMPLETED: "completed a lesson",
  QUIZ_ATTEMPTED: "attempted a knowledge check",
  COURSE_COMPLETED: "completed a course",
};

function StatTile({
  label,
  value,
  caption,
}: {
  label: string;
  value: number | string;
  caption: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums text-brand-navy">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{caption}</p>
    </div>
  );
}

export function AdminDashboard() {
  const [status, setStatus] = useState<
    "loading" | "denied" | "ready" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  const load = useCallback(async () => {
    const client = getDataClient();
    if (!client) {
      setStatus("error");
      setMessage("The data backend is not configured for this build.");
      return;
    }

    try {
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken?.payload?.["cognito:groups"];
      if (!Array.isArray(groups) || !groups.includes("admins")) {
        setStatus("denied");
        return;
      }

      const days = lastSevenDays();
      const [trainees, enrollments, eventPages] = await Promise.all([
        client.models.Trainee.list({ limit: 1000 }),
        client.models.Enrollment.list({ limit: 1000 }),
        Promise.all(
          days.map((day) =>
            client.models.ActivityEvent.listActivityEventByDayAndOccurredAt(
              { day },
              { limit: 1000 }
            )
          )
        ),
      ]);

      setDashboard({
        days,
        trainees: (trainees.data ?? []) as Trainee[],
        enrollments: (enrollments.data ?? []) as Enrollment[],
        events: eventPages.flatMap((page) => (page.data ?? []) as ActivityEvent[]),
      });
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    if (!dashboard) return null;
    const { trainees, enrollments, events, days } = dashboard;
    const weekStart = `${days[0]}T00:00:00.000Z`;

    const byDay = new Map(days.map((day) => [day, 0]));
    const activeTrainees = new Set<string>();
    let lessonsThisWeek = 0;
    let checksThisWeek = 0;

    for (const event of events) {
      byDay.set(event.day, (byDay.get(event.day) ?? 0) + 1);
      activeTrainees.add(event.traineeId);
      if (event.type === "LESSON_COMPLETED") lessonsThisWeek += 1;
      if (event.type === "QUIZ_ATTEMPTED") checksThisWeek += 1;
    }

    const perCourse = courses.map((course) => {
      const rows = enrollments.filter(
        (enrollment) => enrollment.courseSlug === course.slug
      );
      const completed = rows.filter((row) => row.status === "COMPLETED").length;
      const passed = rows.filter((row) => row.quizPassed).length;
      return {
        slug: course.slug,
        order: course.order,
        title: course.title,
        enrolled: rows.length,
        completed,
        passed,
        completionRate:
          rows.length === 0 ? 0 : Math.round((completed / rows.length) * 100),
      };
    });

    const now = new Date().toISOString();
    const overdue = enrollments
      .filter(
        (enrollment) =>
          enrollment.status !== "COMPLETED" &&
          enrollment.dueAt &&
          enrollment.dueAt < now
      )
      .sort((a, b) => (a.dueAt ?? "").localeCompare(b.dueAt ?? ""));

    const traineeById = new Map(
      trainees.map((trainee) => [trainee.id, trainee])
    );
    // Staff accounts have a record too, but they are not the trainee headcount.
    const learners = trainees.filter((trainee) => trainee.role !== "admin");

    const learnerIds = new Set(learners.map((trainee) => trainee.id));

    return {
      traineeCount: learners.length,
      newThisWeek: learners.filter((trainee) => trainee.signedUpAt >= weekStart)
        .length,
      activeThisWeek: [...activeTrainees].filter((id) => learnerIds.has(id))
        .length,
      lessonsThisWeek,
      checksThisWeek,
      byDay: days.map((day) => ({ day, count: byDay.get(day) ?? 0 })),
      perCourse,
      overdue,
      traineeById,
      recent: [...events]
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        .slice(0, 12),
    };
  }, [dashboard]);

  if (status === "loading") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="text-sm text-zinc-500">Loading analytics…</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-brand-navy">
          Staff only
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          This dashboard is limited to the <code>admins</code> group. Ask
          well command  Assurance to add your account if you need access.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex text-sm font-medium text-zinc-500 hover:text-brand-navy"
        >
          &larr; Curriculum
        </Link>
      </main>
    );
  }

  if (status === "error" || !metrics) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-brand-navy">
          Analytics
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Could not load analytics: {message}
        </p>
      </main>
    );
  }

  const peakDay = Math.max(1, ...metrics.byDay.map((entry) => entry.count));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Analytics
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
        Sign-ups, activity, and course completion across every trainee on the
        platform.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Trainees"
          value={metrics.traineeCount}
          caption={`${metrics.newThisWeek} new this week`}
        />
        <StatTile
          label="Active this week"
          value={metrics.activeThisWeek}
          caption="Signed in or made progress"
        />
        <StatTile
          label="Lessons completed"
          value={metrics.lessonsThisWeek}
          caption="This week"
        />
        <StatTile
          label="Knowledge checks"
          value={metrics.checksThisWeek}
          caption="Attempts this week"
        />
      </div>

      <section className="mt-10 rounded-lg border border-[var(--brand-border)] bg-white p-5">
        <h2 className="font-serif text-lg font-semibold text-brand-navy">
          Activity, last 7 days
        </h2>
        <div className="mt-5 flex items-end gap-2">
          {metrics.byDay.map((entry) => (
            <div
              key={entry.day}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-xs font-medium tabular-nums text-zinc-600">
                {entry.count}
              </span>
              {/* Bar heights are in pixels: a percentage height would have no
                  definite parent to resolve against and collapse to nothing. */}
              <span
                className="mx-auto w-full max-w-12 rounded-t bg-brand-gold"
                style={{
                  height: `${Math.max(2, Math.round((entry.count / peakDay) * BAR_MAX_PX))}px`,
                }}
                role="img"
                aria-label={`${entry.count} events on ${entry.day}`}
              />
              <span className="text-xs text-zinc-500">
                {weekdayLabel(entry.day)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Per-course completion
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--brand-border)] bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr className="border-b border-[var(--brand-border)]">
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Check passed</th>
                <th className="px-4 py-3 font-medium">Completion rate</th>
              </tr>
            </thead>
            <tbody>
              {metrics.perCourse.map((row) => (
                <tr
                  key={row.slug}
                  className="border-b border-[var(--brand-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-brand-navy">
                    {row.order}. {row.title}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600">
                    {row.enrolled}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600">
                    {row.completed}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600">
                    {row.passed}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200">
                        <span
                          aria-hidden
                          className="block h-full rounded-full bg-brand-gold"
                          style={{ width: `${row.completionRate}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-zinc-500">
                        {row.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Overdue courses
        </h2>
        {metrics.overdue.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Nothing overdue.</p>
        ) : (
          <ul className="mt-4 rounded-lg border border-[var(--brand-border)] bg-white">
            {metrics.overdue.map((enrollment) => (
              <li
                key={`${enrollment.traineeId}-${enrollment.courseSlug}`}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--brand-border)] px-4 py-3 last:border-0"
              >
                <span className="text-sm text-brand-navy">
                  {metrics.traineeById.get(enrollment.traineeId)?.email ??
                    "Unknown"}
                </span>
                <span className="text-sm text-zinc-600">
                  {enrollment.courseTitle}
                </span>
                <span className="text-xs text-zinc-500">
                  Overdue &middot;{" "}
                  {new Date(enrollment.dueAt ?? "").toLocaleDateString("en-US")}{" "}
                  &middot; {enrollment.percentComplete ?? 0}% done
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Recent activity
        </h2>
        {metrics.recent.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No activity recorded yet.</p>
        ) : (
          <ul className="mt-4 rounded-lg border border-[var(--brand-border)] bg-white">
            {metrics.recent.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--brand-border)] px-4 py-3 last:border-0"
              >
                <span className="text-sm text-brand-navy">
                  {metrics.traineeById.get(event.traineeId)?.email ?? "Unknown"}
                </span>
                <span className="text-sm text-zinc-600">
                  {ACTIVITY_LABELS[event.type] ?? event.type}
                  {event.courseSlug ? ` — ${event.courseSlug}` : ""}
                  {event.detail ? ` (${event.detail})` : ""}
                </span>
                <span className="text-xs tabular-nums text-zinc-500">
                  {relativeTime(event.occurredAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
