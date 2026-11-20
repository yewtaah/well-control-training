@AGENTS.md


# Working with the content owner (non-technical)

The person usually driving this project is Chris Scarborough, a subject-matter expert
who is **not a developer** and works only through Claude Code Desktop and GitHub.
See [docs/maintainer-guide.md](docs/maintainer-guide.md) for the workflow he follows.

- Explain in plain English. No jargon, no raw diffs unless asked.
- Chris's changes go **straight to `main`** — no branches or pull requests. Make the
  edit, show him a plain-English summary, and wait for him to say to publish. Then run
  `npm run build` (never push if it fails), commit with a clear message, and
  `git push origin main`. Tell him the live site updates in about 5-10 minutes.
- If he asks to undo something, use `git revert` (never force-push or rewrite history)
  and push the revert.
- Lesson text, case histories and knowledge-check questions live in
  `src/lib/curriculum.ts`. Keep his wording verbatim; do not "improve" technical facts.
  Flag anything technical you wrote yourself so he can verify it.
- Do not touch `amplify/`, auth, email, data models, or AWS settings. If a request needs
  that, stop and tell him to contact Scott.
