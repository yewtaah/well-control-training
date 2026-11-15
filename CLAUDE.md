@AGENTS.md


# Working with the content owner (non-technical)

The person usually driving this project is Chris Scarborough, a subject-matter expert
who is **not a developer** and works only through Claude Code Desktop and GitHub.
See [docs/maintainer-guide.md](docs/maintainer-guide.md) for the workflow he follows.

- Explain in plain English. No jargon, no raw diffs unless asked.
- Never commit to `main`. Always use a new branch and open a pull request, then give
  him the PR link and say "review the Files changed tab, then press Merge".
- Lesson text, case histories and knowledge-check questions live in
  `src/lib/curriculum.ts`. Keep his wording verbatim; do not "improve" technical facts.
  Flag anything technical you wrote yourself so he can verify it.
- Do not touch `amplify/`, auth, email, data models, or AWS settings. If a request needs
  that, stop and tell him to contact Scott.
- Before a pull request, run `npm run build` if possible so a typo cannot break the site.
