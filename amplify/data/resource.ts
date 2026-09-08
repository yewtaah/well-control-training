import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

/**
 * Data model for Well Command WC Training.
 *
 * Shaped for analytics as well as display: alongside the per-learner records
 * there is an append-only ActivityEvent log, so questions like "how many
 * trainees signed up this week" or "how much progress was made this week" are
 * answered by a time-window query rather than by scanning learner state.
 *
 * Authorization: a trainee owns their own records; the `admins` group can read
 * everything for reporting.
 */

const schema = a
  .schema({
    EnrollmentStatus: a.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),

    ActivityType: a.enum([
      "SIGN_UP",
      "SIGN_IN",
      "COURSE_STARTED",
      "LESSON_COMPLETED",
      "QUIZ_ATTEMPTED",
      "COURSE_COMPLETED",
    ]),

    /** One record per registered learner, created on first sign-in. */
    Trainee: a
      .model({
        email: a.string().required(),
        displayName: a.string(),
        company: a.string(),
        jobTitle: a.string(),
        /** Free-text role, e.g. "Driller", "Drilling Engineer", "Office". */
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

    /** A trainee's standing on one course. Rolled up as progress is recorded. */
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
        /** Assigned deadline; drives the overdue report. */
        dueAt: a.datetime(),
        lessons: a.hasMany("LessonCompletion", "enrollmentId"),
        attempts: a.hasMany("QuizAttempt", "enrollmentId"),
      })
      .secondaryIndexes((index) => [
        index("courseSlug").sortKeys(["status"]),
        index("status").sortKeys(["dueAt"]),
      ])
      .authorization((allow) => [
        allow.owner(),
        allow.group("admins").to(["read"]),
      ]),

    /** One row per lesson completed, kept for weekly progress reporting. */
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
      .secondaryIndexes((index) => [index("courseSlug").sortKeys(["completedAt"])])
      .authorization((allow) => [
        allow.owner(),
        allow.group("admins").to(["read"]),
      ]),

    /** Every knowledge check attempt, not just the best one. */
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
      .secondaryIndexes((index) => [index("courseSlug").sortKeys(["attemptedAt"])])
      .authorization((allow) => [
        allow.owner(),
        allow.group("admins").to(["read"]),
      ]),

    /**
     * Append-only activity log. Partitioned by a coarse `day` bucket so a
     * "this week" query is seven cheap reads rather than a table scan.
     */
    ActivityEvent: a
      .model({
        traineeId: a.id().required(),
        trainee: a.belongsTo("Trainee", "traineeId"),
        type: a.ref("ActivityType").required(),
        /** ISO date, YYYY-MM-DD, used as the query partition. */
        day: a.string().required(),
        courseSlug: a.string(),
        detail: a.string(),
        occurredAt: a.datetime().required(),
      })
      .secondaryIndexes((index) => [
        index("day").sortKeys(["occurredAt"]),
        index("type").sortKeys(["occurredAt"]),
      ])
      .authorization((allow) => [
        allow.owner(),
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
