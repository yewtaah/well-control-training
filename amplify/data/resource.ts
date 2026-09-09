import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

/**
 * Analytics-ready model (issue #26). Progress is stored as immutable, timestamped
 * rows plus a rolled-up `Enrollment` per trainee × course, so the dashboard can
 * answer "what happened this week" with an index query rather than a table scan.
 *
 * Authorization: a trainee owns their own rows (owner auth also filters their
 * `list` queries down to just them); the `admins` Cognito group reads everything.
 */
const schema = a.schema({
  EnrollmentStatus: a.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),

  ActivityType: a.enum([
    "SIGN_UP",
    "SIGN_IN",
    "LESSON_COMPLETED",
    "QUIZ_ATTEMPTED",
    "COURSE_COMPLETED",
  ]),

  /** One row per learner, keyed by their Cognito subject id. */
  Trainee: a
    .model({
      email: a.email().required(),
      displayName: a.string(),
      company: a.string(),
      jobTitle: a.string(),
      role: a.string(),
      signedUpAt: a.datetime().required(),
      lastSeenAt: a.datetime(),
      signInCount: a.integer().default(0),
      enrollments: a.hasMany("Enrollment", "traineeId"),
      activity: a.hasMany("ActivityEvent", "traineeId"),
    })
    .secondaryIndexes((index) => [index("email")])
    .authorization((allow) => [
      allow.owner(),
      allow.group("admins").to(["read"]),
    ]),

  /** A learner's relationship with one course, kept rolled up for reporting. */
  Enrollment: a
    .model({
      traineeId: a.id().required(),
      trainee: a.belongsTo("Trainee", "traineeId"),
      courseSlug: a.string().required(),
      courseTitle: a.string().required(),
      status: a.ref("EnrollmentStatus").required(),
      lessonsCompleted: a.integer().default(0),
      lessonsTotal: a.integer().required(),
      percentComplete: a.integer().default(0),
      bestQuizPercent: a.integer(),
      quizPassed: a.boolean().default(false),
      startedAt: a.datetime(),
      completedAt: a.datetime(),
      dueAt: a.datetime(),
      lessons: a.hasMany("LessonCompletion", "enrollmentId"),
      attempts: a.hasMany("QuizAttempt", "enrollmentId"),
    })
    .secondaryIndexes((index) => [
      // Completion and pass rates per course.
      index("courseSlug").sortKeys(["status"]),
      // Courses overdue against their due date.
      index("status").sortKeys(["dueAt"]),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group("admins").to(["read"]),
    ]),

  /** One immutable row per lesson a learner ticks off. */
  LessonCompletion: a
    .model({
      enrollmentId: a.id().required(),
      enrollment: a.belongsTo("Enrollment", "enrollmentId"),
      traineeId: a.id().required(),
      courseSlug: a.string().required(),
      moduleSlug: a.string().required(),
      lessonSlug: a.string().required(),
      completedAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("courseSlug").sortKeys(["completedAt"]),
    ])
    // Created when a lesson is ticked and deleted when it is un-ticked, never
    // edited — so no update, and no reassigning the row to someone else.
    .authorization((allow) => [
      allow.owner().to(["create", "read", "delete"]),
      allow.group("admins").to(["read"]),
    ]),

  /** Every knowledge-check attempt, not just the best one. */
  QuizAttempt: a
    .model({
      enrollmentId: a.id().required(),
      enrollment: a.belongsTo("Enrollment", "enrollmentId"),
      traineeId: a.id().required(),
      courseSlug: a.string().required(),
      scorePercent: a.integer().required(),
      passed: a.boolean().required(),
      questionCount: a.integer().required(),
      correctCount: a.integer().required(),
      attemptedAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("courseSlug").sortKeys(["attemptedAt"]),
    ])
    // Every attempt stands as recorded — a score cannot be edited after the fact.
    .authorization((allow) => [
      allow.owner().to(["create", "read"]),
      allow.group("admins").to(["read"]),
    ]),

  /**
   * Append-only event log. `day` (YYYY-MM-DD, UTC) partitions the index so a
   * "this week" rollup is seven cheap queries instead of a scan.
   */
  ActivityEvent: a
    .model({
      traineeId: a.id().required(),
      trainee: a.belongsTo("Trainee", "traineeId"),
      type: a.ref("ActivityType").required(),
      day: a.string().required(),
      courseSlug: a.string(),
      detail: a.string(),
      occurredAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("type").sortKeys(["occurredAt"]),
      index("day").sortKeys(["occurredAt"]),
    ])
    // Append-only: the audit trail is worthless if a trainee can rewrite it.
    .authorization((allow) => [
      allow.owner().to(["create", "read"]),
      allow.group("admins").to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
