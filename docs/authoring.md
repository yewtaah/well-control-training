# Authoring course content

Content is WellCommand Assurance's to write. This document covers how it gets
into the site today, and the options for removing the developer from that loop.

## Today

All twelve courses live in [`src/lib/curriculum.ts`](../src/lib/curriculum.ts) as
typed data. One `Course` carries its metadata (order, duration, objectives,
prerequisites, draft/published status), its modules and lessons, and its
knowledge check.

To add or change a lesson, edit that file and open a pull request. TypeScript
catches structural mistakes — a missing summary, a quiz answer index that points
past the end of the options — before the site builds.

This is fine for the first pass, where the shape of the programme is still
settling. It does not scale to Chris editing content himself.

## Options

| Option | Effort | Who can edit | Trade-off |
|---|---|---|---|
| **MDX files in the repo** | Low | Anyone comfortable with GitHub's web editor | Content lives beside the code with real version history and review, but every change is still a commit. |
| **Headless CMS** (Sanity, Contentful, Payload) | Medium | Anyone, in a friendly editor | Purpose-built editing, media handling, scheduled publishing. Adds a second system, a second bill, and a second place content can be wrong. |
| **In-app admin editor** on Amplify Data | Medium–high | Admins, in the site itself | One system, one login, and course content sits in the same store as progress — so authoring and analytics share a model. Most work to build, and we own the editor. |

## Recommendation

**MDX in the repo** as the next step: it removes the developer from routine
wording changes at almost no cost, and keeps review. Move to the in-app editor
once the curriculum is stable and Chris is editing regularly — at that point the
shared model with progress data is worth the build.
