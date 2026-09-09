# Screenshot deck

Captures of the running platform, for sharing with clients and for the project
README. Every shot is of the real app signed in as a demo trainee (or a staff
account for the dashboard), against seeded demo data — nothing is mocked up.

## The deck, in order

| # | Shot | What it shows | Talking point |
|---|------|---------------|---------------|
| 1 | [Sign in](01-sign-in.png) | The branded Cognito sign-in | Access is by account; nobody browses the course anonymously |
| 2 | [Programme overview](02-home.png) | Objective, twelve-course curriculum, progress | The whole programme on one screen, in Chris's structure |
| 3 | [Curriculum](03-curriculum.png) | The course list with per-course progress | Where a returning trainee picks up |
| 4 | [Course page](04-course.png) | Objectives, prerequisites, modules, knowledge check | Each course states what you will be able to do |
| 5 | [Lesson](05-lesson.png) | A single lesson and its completion control | One idea per screen, sized for a short sitting |
| 6 | [Knowledge check](06-knowledge-check.png) | The questions before submitting | Every course ends with one |
| 7 | [Result](07-knowledge-check-result.png) | Score, pass mark, per-question explanations | Wrong answers are taught, not just marked |
| 8 | [Choke drill](08-simulator.png) | The simulator preview mid-run | Hands-on practice, previewed — the roadmap is in [`../simulator.md`](../simulator.md) |
| 9 | [Analytics](09-admin.png) | The staff dashboard | Who signed up, who is active, how each course is landing |
| 10 | [Certificate](10-certificate.png) | A printable completion record | Issued in the trainee's name, with a verifiable reference |

Phone captures at 375px: [overview](02-home-mobile.png),
[curriculum](03-curriculum-mobile.png), [course](04-course-mobile.png) — the
audience includes field personnel, so the phone view is the real view.

## Refreshing these

They are captured from a local dev server against a seeded sandbox, so they can
be regenerated whenever the UI changes:

```bash
npx ampx sandbox                       # stand up a backend (Node 20)
npx tsx scripts/seed-demo-data.ts      # demo trainees and progress
npm run dev                            # then drive a browser at it
```

The demo accounts are `demo.trainee@example.com` and `staff.admin@example.com`
(the latter added to the `admins` group). Create them with
`aws cognito-idp admin-create-user` against the sandbox pool; they are demo
fixtures and exist only in a personal sandbox, never in production.
