"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { courses } from "@/lib/curriculum";
import { getClient } from "@/lib/dataClient";
import { isOverdue, percent, recentDays, weekAgo } from "@/lib/analytics";

type Trainee = {
  id: string;
  email: string;
  displayName?: string | null;
  company?: string | null;
  signedUpAt: string;
  lastSeenAt?: string | null;
  signInCount?: number | null;
};

type Enrollment = {
  id: string;
  traineeId: string;
  courseSlug: string;
  courseTitle: string;
  status: string;
  percentComplete?: number | null;
  quizPassed?: boolean | null;
  bestQuizPercent?: number | null;
  dueAt?: string | null;
  completedAt?: string | null;
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

type Report = {
  trainees: Trainee[];
  enrollments: Enrollment[];
  events: ActivityEvent[];
};

function StatTile({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums text-brand-navy">
        {value}
      </p>
      {caption ? (
        <p className="mt-1 text-xs text-zinc-500">{caption}</p>
      ) : null}
    </div>
  );
}

/** Single-series daily activity. One hue, direct-labelled, no legend needed. */
function WeeklyActivity({ counts }: { counts: { day: string; count: number }[] }) {
  const max = Math.max(1, ...counts.map((entry) => entry.count));
  return (
    <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
      <h2 className="font-serif text-lg font-semibold text-brand-navy">
        Activity, last 7 days
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Sign-ins, lessons completed, and knowledge checks attempted per day.
      </p>
      <ul className="mt-5 flex items-end gap-2" style={{ height: 120 }}>
        {counts.map((entry) => {
          const height = Math.round((entry.count / max) * 96);
          const weekday = new Date(`${entry.day}T00:00:00Z`).toLocaleDateString(
            undefined,
            { weekday: "short", timeZone: "UTC" }
          );
          return (
            <li
              key={entry.day}
              className="flex flex-1 flex-col items-center justify-end gap-2"
              title={`${entry.day}: ${entry.count}`}
            >
              <span className="text-xs font-medium tabular-nums text-zinc-600">
                {entry.count}
              </span>
              <span
                className="w-full rounded-t bg-brand-gold"
                style={{ height: Math.max(2, height) }}
                aria-hidden
              />
              <span className="text-xs text-zinc-500">{weekday}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AdminDashboard() {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "denied" }
    | { kind: "error"; message: string }
    | { kind: "ready"; report: Report }
  >({ kind: "loading" });

  useEffect(() => {
    void (async () => {
      try {
        const session = await fetchAuthSession();
        const groups =
          (session.tokens?.idToken?.payload["cognito:groups"] as
            | string[]
            | undefined) ?? [];
        if (!groups.includes("admins")) {
          setState({ kind: "denied" });
          return;
        }

        const client = getClient();
        const days = recentDays(7);
        const [trainees, enrollments, ...dayResults] = await Promise.all([
          client.models.Trainee.list({ limit: 1000 }),
          client.models.Enrollment.list({ limit: 1000 }),
          ...days.map((day) =>
            client.models.ActivityEvent.list({
              filter: { day: { eq: day } },
              limit: 1000,
            })
          ),
        ]);

        setState({
          kind: "ready",
          report: {
            trainees: (trainees.data ?? []) as Trainee[],
            enrollments: (enrollments.data ?? []) as Enrollment[],
            events: dayResults.flatMap(
              (result) => (result.data ?? []) as ActivityEvent[]
            ),
          },
        });
      } catch (cause) {
        setState({
          kind: "error",
          message: cause instanceof Error ? cause.message : String(cause),
        });
      }
    })();
  }, []);

  const summary = useMemo(() => {
    if (state.kind !== "ready") return null;
    const { trainees, enrollments, events } = state.report;
    const since = weekAgo();

    const newTrainees = trainees.filter(
      (trainee) => trainee.signedUpAt >= since
    ).length;
    const activeTrainees = new Set(
      events
        .filter((event) => event.occurredAt >= since)
        .map((event) => event.traineeId)
    ).size;
    const lessonsThisWeek = events.filter(
      (event) => event.type === "LESSON_COMPLETED" && event.occurredAt >= since
    ).length;
    const quizzesThisWeek = events.filter(
      (event) => event.type === "QUIZ_ATTEMPTED" && event.occurredAt >= since
    ).length;
    const overdue = enrollments.filter((enrollment) =>
      isOverdue(enrollment.dueAt, enrollment.status)
    );

    const dailyCounts = recentDays(7)
      .map((day) => ({
        day,
        count: events.filter((event) => event.day === day).length,
      }))
      .reverse();

    const perCourse = courses.map((course) => {
      const rows = enrollments.filter(
        (enrollment) => enrollment.courseSlug === course.slug
      );
      const completed = rows.filter((row) => row.status === "COMPLETED").length;
      const passed = rows.filter((row) => row.quizPassed).length;
      return {
        course,
        enrolled: rows.length,
        completed,
        passed,
        completionRate: percent(completed, rows.length),
      };
    });

    return {
      newTrainees,
      activeTrainees,
      lessonsThisWeek,
      quizzesThisWeek,
      overdue,
      dailyCounts,
      perCourse,
      totalTrainees: trainees.length,
      traineesById: new Map(trainees.map((trainee) => [trainee.id, trainee])),
      recentEvents: [...events]
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        .slice(0, 15),
    };
  }, [state]);

  if (state.kind === "loading") {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <p className="text-sm text-zinc-500">Loading analytics&hellip;</p>
      </main>
    );
  }

  if (state.kind === "denied") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-brand-navy">
          Analytics
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          This dashboard is limited to WellCommand Assurance staff. Ask an
          administrator to add your account to the <code>admins</code> group.
        </p>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-brand-navy">
          Analytics
        </h1>
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load analytics: {state.message}
        </p>
      </main>
    );
  }

  if (!summary) return null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-navy">
        Analytics
      </h1>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Enrolment and progress across the Well Command WC Training programme.
      </p>

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Trainees"
          value={summary.totalTrainees}
          caption={`${summary.newTrainees} new this week`}
        />
        <StatTile
          label="Active this week"
          value={summary.activeTrainees}
          caption="Signed in or made progress"
        />
        <StatTile
          label="Lessons completed"
          value={summary.lessonsThisWeek}
          caption="This week"
        />
        <StatTile
          label="Knowledge checks"
          value={summary.quizzesThisWeek}
          caption="Attempts this week"
        />
      </section>

      <div className="mt-6">
        <WeeklyActivity counts={summary.dailyCounts} />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Overdue courses
        </h2>
        {summary.overdue.length === 0 ? (
          <p className="mt-3 rounded-lg border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-zinc-600">
            Nothing overdue.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--brand-border)] bg-white">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-[var(--brand-border)] text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Trainee</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {summary.overdue.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-[var(--brand-border)] last:border-0"
                  >
                    <td className="px-4 py-3 text-brand-navy">
                      {summary.traineesById.get(enrollment.traineeId)?.email ??
                        "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {enrollment.courseTitle}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800">
                        Overdue &middot;{" "}
                        {new Date(enrollment.dueAt ?? "").toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-600">
                      {enrollment.percentComplete ?? 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-brand-navy">
          Per-course completion
        </h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--brand-border)] bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-[var(--brand-border)] text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Check passed</th>
                <th className="px-4 py-3 font-medium">Completion rate</th>
              </tr>
            </thead>
            <tbody>
              {summary.perCourse.map((row) => (
                <tr
                  key={row.course.slug}
                  className="border-b border-[var(--brand-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-brand-navy">
                    {row.course.order}. {row.course.title}
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
                      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200">
                        <span
                          className="block h-full rounded-full bg-brand-gold"
                          style={{ width: `${row.completionRate}%` }}
                        />
                      </span>
                      <span className="tabular-nums text-zinc-600">
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
          Recent activity
        </h2>
        <ul className="mt-3 divide-y divide-[var(--brand-border)] rounded-lg border border-[var(--brand-border)] bg-white">
          {summary.recentEvents.length === 0 ? (
            <li className="px-4 py-3 text-sm text-zinc-600">
              No activity recorded yet.
            </li>
          ) : (
            summary.recentEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="text-brand-navy">
                  {summary.traineesById.get(event.traineeId)?.email ?? "Unknown"}
                </span>
                <span className="text-zinc-600">
                  {event.type.toLowerCase().replaceAll("_", " ")}
                  {event.courseSlug ? ` — ${event.courseSlug}` : ""}
                </span>
                <span className="tabular-nums text-zinc-500">
                  {new Date(event.occurredAt).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
