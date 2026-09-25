/**
 * Seeds a sandbox backend with demo trainees and progress, so the dashboard and
 * the certificates have something real to show in screenshots and demos.
 *
 * It writes through the same Amplify Data client the app uses, so a successful
 * run is also an end-to-end check of the schema and its authorization rules.
 *
 *   npx tsx scripts/seed-demo-data.ts
 *
 * Requires Node 20, a deployed sandbox (`npx ampx sandbox`), and the demo users
 * to exist in the pool. Never point this at production.
 */
import { Amplify } from "aws-amplify";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../amplify/data/resource";
import { allLessonsInOrder, courses, lessonCount } from "../src/lib/curriculum";

Amplify.configure(outputs);
const client = generateClient<Schema>();

const PASSWORD = process.env.DEMO_PASSWORD ?? "WcTraining!2026";

/** How far through the programme each demo trainee is. */
const TRAINEES = [
  {
    email: "demo.trainee@example.com",
    displayName: "Demo Trainee",
    company: "Well Command  Assurance",
    jobTitle: "Drilling Supervisor",
    /** Courses finished outright (lessons + a passing check). */
    completedCourses: 3,
    /** Fraction of the next course's lessons done. */
    partial: 0.5,
    daysActive: 6,
  },
  {
    email: "j.alvarez@example.com",
    displayName: "J. Alvarez",
    company: "Gulf Coast Drilling",
    jobTitle: "Toolpusher",
    completedCourses: 5,
    partial: 0.25,
    daysActive: 4,
  },
  {
    email: "s.okafor@example.com",
    displayName: "S. Okafor",
    company: "Gulf Coast Drilling",
    jobTitle: "Mud Engineer",
    completedCourses: 2,
    partial: 0.8,
    daysActive: 3,
  },
  {
    email: "m.petrov@example.com",
    displayName: "M. Petrov",
    company: "Northfield Energy",
    jobTitle: "Company Man",
    completedCourses: 1,
    partial: 0,
    /** Left an enrollment past its due date, so the overdue panel has content. */
    overdueCourse: 2,
    daysActive: 9,
  },
  {
    email: "r.deshmukh@example.com",
    displayName: "R. Deshmukh",
    company: "Northfield Energy",
    jobTitle: "Derrickhand",
    completedCourses: 0,
    partial: 0.4,
    daysActive: 1,
  },
] as const;

type Trainee = (typeof TRAINEES)[number];

const DAY_MS = 86_400_000;

function daysAgo(days: number, hourOffset = 0): string {
  return new Date(Date.now() - days * DAY_MS + hourOffset * 3_600_000).toISOString();
}

function utcDay(iso: string) {
  return iso.slice(0, 10);
}

function unwrap<T>(result: { data: T; errors?: { message: string }[] }): T {
  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }
  return result.data;
}

async function logActivity(
  traineeId: string,
  type: Schema["ActivityType"]["type"],
  occurredAt: string,
  extra: { courseSlug?: string; detail?: string } = {}
) {
  unwrap(
    await client.models.ActivityEvent.create({
      traineeId,
      type,
      day: utcDay(occurredAt),
      occurredAt,
      ...extra,
    })
  );
}

async function seedTrainee(trainee: Trainee) {
  await signOut().catch(() => undefined);
  const { isSignedIn } = await signIn({
    username: trainee.email,
    password: PASSWORD,
  });
  if (!isSignedIn) throw new Error(`Could not sign in as ${trainee.email}`);

  const traineeId = (await getCurrentUser()).userId;
  if (!traineeId) throw new Error("No user id on the session");

  // Idempotent: a trainee who already has enrollments is left alone, so a
  // repeat run does not double-count. To start over, recreate the sandbox data
  // (`npx ampx sandbox delete`, then `npx ampx sandbox`).
  const seeded = unwrap(await client.models.Enrollment.list({ limit: 1 }));
  if (seeded.length > 0) {
    console.log(`skipped ${trainee.email} — already seeded`);
    return;
  }

  const signedUpAt = daysAgo(trainee.daysActive + 2);
  const existing = unwrap(await client.models.Trainee.get({ id: traineeId }));
  if (!existing) {
    unwrap(
      await client.models.Trainee.create({
        id: traineeId,
        email: trainee.email,
        displayName: trainee.displayName,
        company: trainee.company,
        jobTitle: trainee.jobTitle,
        signedUpAt,
        lastSeenAt: daysAgo(0, -2),
        signInCount: trainee.daysActive,
      })
    );
    await logActivity(traineeId, "SIGN_UP", signedUpAt);
  }

  // A sign-in on each of the days this trainee has been active.
  for (let day = trainee.daysActive; day >= 0; day -= 1) {
    await logActivity(traineeId, "SIGN_IN", daysAgo(day, -3));
  }

  const throughCourse = trainee.completedCourses;
  for (const [index, course] of courses.entries()) {
    const overdue =
      "overdueCourse" in trainee && trainee.overdueCourse === index;
    const complete = index < throughCourse;
    // An overdue course still gets an enrollment — that is the point of it.
    const inProgress =
      (index === throughCourse && trainee.partial > 0) || overdue;
    if (!complete && !inProgress) continue;

    const lessons = allLessonsInOrder(course);
    const total = lessonCount(course);
    const doneCount = complete
      ? total
      : Math.max(1, Math.round(total * (trainee.partial || 0.2)));
    // Spread the work backwards from today so the weekly chart has a shape.
    const startedAt = daysAgo(trainee.daysActive - index * 0.5);

    const enrollment = unwrap(
      await client.models.Enrollment.create({
        traineeId,
        courseSlug: course.slug,
        courseTitle: course.title,
        status: complete ? "COMPLETED" : "IN_PROGRESS",
        lessonsTotal: total,
        lessonsCompleted: doneCount,
        percentComplete: Math.round((doneCount / total) * 100),
        bestQuizPercent: complete ? 83 + ((index * 7) % 15) : undefined,
        quizPassed: complete,
        startedAt,
        completedAt: complete ? daysAgo(trainee.daysActive - index - 1) : undefined,
        dueAt: overdue ? daysAgo(3) : undefined,
      })
    );
    if (!enrollment?.id) throw new Error("Enrollment not created");

    for (let i = 0; i < doneCount; i += 1) {
      const entry = lessons[i];
      const completedAt = daysAgo(
        Math.max(0, trainee.daysActive - index - i * 0.15)
      );
      unwrap(
        await client.models.LessonCompletion.create({
          enrollmentId: enrollment.id,
          traineeId,
          courseSlug: course.slug,
          moduleSlug: entry.courseModule.slug,
          lessonSlug: entry.lesson.slug,
          completedAt,
        })
      );
      await logActivity(traineeId, "LESSON_COMPLETED", completedAt, {
        courseSlug: course.slug,
        detail: `${entry.courseModule.slug}/${entry.lesson.slug}`,
      });
    }

    if (complete) {
      const questionCount = course.quiz.questions.length;
      const scorePercent = enrollment.bestQuizPercent ?? 85;
      const attemptedAt = daysAgo(Math.max(0, trainee.daysActive - index - 1));
      unwrap(
        await client.models.QuizAttempt.create({
          enrollmentId: enrollment.id,
          traineeId,
          courseSlug: course.slug,
          scorePercent,
          correctCount: Math.round((scorePercent / 100) * questionCount),
          questionCount,
          passed: true,
          attemptedAt,
        })
      );
      await logActivity(traineeId, "QUIZ_ATTEMPTED", attemptedAt, {
        courseSlug: course.slug,
        detail: `${scorePercent}%`,
      });
      await logActivity(traineeId, "COURSE_COMPLETED", attemptedAt, {
        courseSlug: course.slug,
      });
    }
  }

  console.log(
    `seeded ${trainee.email} — ${throughCourse} courses complete` +
      (trainee.partial ? `, part-way through the next` : "")
  );
}

async function main() {
  for (const trainee of TRAINEES) {
    await seedTrainee(trainee);
  }
  await signOut().catch(() => undefined);
  console.log("done");
}

void main();
