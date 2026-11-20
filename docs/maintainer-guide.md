# 📘 Maintainer's Guide

**Keeping the Well Command training site up to date — using only Claude and GitHub.**

Written for Chris Scarborough. No coding, no VS Code, no command line. You tell
Claude what you want changed in plain English; Claude changes it and publishes it.

---

## 🧭 The big picture

```
 You ──► Claude Code Desktop ──► GitHub ──► Live website
 say what     makes the change    stores      rebuilds itself
 you want     and saves it        the change  in ~5–10 minutes
```

| Piece | What it is | Your job |
|-------|-----------|----------|
| **Claude Code Desktop** | The Claude app, **Code** tab. It edits the site's files for you. | Describe the change. Check Claude's summary. |
| **GitHub** | Where the site's files live, with a full history of every change. | Nothing day-to-day — it's your safety net. |
| **The live site** | Rebuilds automatically after each change. | Look at it and confirm it's right. |

**Your safety net:** GitHub remembers every version of every file. Any change can be
undone (see [🆘 Undoing a mistake](#-undoing-a-mistake)).

---

## 🛠️ Part 1 — One-time setup (about 30 minutes, do it with Scott)

Do this once. You will not repeat it.

1. **Claude Pro** — already done. Install the **Claude desktop app** from
   claude.ai/download and sign in.
2. **GitHub account** — sign in at github.com. You have already been added to the
   repository `yewtaah/well-control-training`; accept the invitation email if you
   haven't.
3. **Git** — *Windows only:* install **Git for Windows** from git-scm.com
   (accept all the default options). Mac users can skip this.
4. **Open the project in Claude** — in the Claude app, open the **Code** tab and
   choose the GitHub repository `yewtaah/well-control-training` (sign in to GitHub
   when asked). Claude will download a copy to your computer.
   *(Button names change from time to time. If you get stuck, ask Scott — or
   type "Help me open the well-control-training project from GitHub" into Claude.)*
5. **Check it works** — in the Code tab, type:
   > Tell me what this project is and where the lesson text lives.

   If Claude answers sensibly, you're set up.

> 🔐 **Safe to know:** Claude asks permission before it changes files or runs
> anything. Read each request. If you're unsure, choose **No** and ask Claude to
> explain.

---

## ✏️ Part 2 — The everyday routine

Every change follows the same four steps.

### Step 1 · Open the project
Open the Claude app → **Code** tab → pick **well-control-training**.

### Step 2 · Describe the change
> **Example:**
> In the *Well Kill Methods* course, add a case history about the Piper Alpha
> disaster at the end of the first lesson. Here is the text: *[paste your text]*.

Tips for good requests:
- Name the **course** and **lesson** (use the titles you see on the site).
- **Paste your exact wording** if you have it. Otherwise say "draft something and I'll edit it".
- **One topic per request.** Small changes are easier to check and undo.

### Step 3 · Check Claude's summary, then tell it to publish
Claude will describe what it changed. Ask follow-ups freely:
> Show me exactly what text you changed.
> Does this change anything other than lesson text?

When you're happy:
> Looks good — check the site still builds, then save it and push it to GitHub.

Claude saves ("commits") the change and sends it to GitHub, which publishes it.

### Step 4 · Check the live site
Wait about **5–10 minutes**, then refresh the site and look at your change.

> If it looks wrong, jump to [🆘 Undoing a mistake](#-undoing-a-mistake).

⚠️ **There is no draft stage.** Once you tell Claude to push, the change goes live
automatically. Read Claude's summary *before* you say yes. If the build fails, the
old version of the site stays up, so a typo can't take the site down.

---

## 🗂️ Part 3 — Common jobs, with ready-to-paste requests

All the course content — lessons, summaries, and knowledge checks — lives in one
file, `src/lib/curriculum.ts`. You never need to open it; Claude does.

### 📝 Edit lesson text
> In the *Pressure Fundamentals* course, lesson *Hydrostatic Pressure*, replace the
> second paragraph with this text: *[paste]*.

### 🏗️ Add a case history
> Add a case history to the lesson *[lesson title]* in *[course title]*. Title it
> "Case History: [name]". Use this material: *[paste notes]*. Keep my facts exactly as
> written.

### ✅ Change or add knowledge-check questions
Each course ends with a knowledge check. Every question has a prompt, answer
options, the correct answer, and an explanation shown after submitting.

> In the *[course title]* knowledge check, add a question: *"[question]"* with
> options A) … B) … C) … D) …. The correct answer is *[letter]*. The explanation
> is: *[text]*.

> Change the pass mark for the *[course title]* knowledge check to 70%.

> Show me every question in the *[course title]* knowledge check so I can review them.

### 🚦 Publish a course that is still a draft
Courses marked **draft** show an "outline placeholder" note on each lesson.

> Replace the placeholder text in every lesson of *[course title]* with the content
> I paste below, then mark the course as published.

### 🔎 Just look something up (changes nothing)
> List all the courses and how many lessons and quiz questions each has.
> Find every place that mentions "kill sheet".

---

## ✅ Part 4 — Before you say "push it": a 60-second checklist

- [ ] Claude's summary shows only the lessons/questions I meant to change.
- [ ] My wording, numbers, and units are exactly right (Claude can slip on technical facts — **you are the subject-matter expert**).
- [ ] For a knowledge-check question: exactly one correct answer, and the explanation matches it.
- [ ] Nothing about sign-in, accounts, or settings was touched. (If it was, stop and ask Scott.)

> 🧠 **Important:** Claude is a fast writer, not a well-control authority. Anything
> technical that Claude drafts from its own knowledge — rather than from your text —
> must be checked by you before it goes live.

---

## 🆘 Undoing a mistake

You cannot permanently break the site: GitHub keeps every version.

| Situation | What to do |
|-----------|-----------|
| **Changed your mind before pushing** | Tell Claude: *"Discard those changes."* Nothing has gone live. |
| **Pushed, and the live site looks wrong** | Tell Claude: *"Undo my last change and push it."* The site goes back to how it was in a few minutes. |
| **Want to undo something older** | Tell Claude: *"Show me my recent changes"*, then *"Undo the one that [describe it]."* |
| **Claude is confused or went off track** | Start a **new** conversation in the Code tab and say what you want again. |
| **Anything involving sign-in, emails, the database, or AWS** | Stop. Message Scott. |

---

## 🧩 What *not* to ask Claude to do

Content changes are safe. Leave these to Scott:

- ❌ Changing sign-in, accounts, or the admin dashboard
- ❌ Changing the AWS setup, email sending, or the database
- ❌ Deleting the repository, or "force-pushing"

---

## 💬 Quick reference

| I want to… | Say to Claude |
|-----------|---------------|
| Change some wording | "In *[course]*, lesson *[lesson]*, change … to …." |
| Add a case history | "Add a case history to *[lesson]* …" |
| Add a quiz question | "In the *[course]* knowledge check, add a question …" |
| See what Claude changed | "Show me exactly what you changed." |
| Publish | "Check it builds, then save it and push it to GitHub." |
| Throw away unpublished work | "Discard those changes." |
| Undo a published change | "Undo my last change and push it." |

**Stuck?** Contact Scott, and send him a screenshot of what you see.

---

## 🧑‍💻 Notes for Scott (not for Chris)

- This guide has Chris commit **straight to `main`** — no branches or pull requests — by
  design, to keep it simple for a non-technical user. Every push triggers an Amplify
  build and `ampx pipeline-deploy`.
- A failed build leaves the previous deployment live (build #9 failed this way and the
  site stayed up), which is the main safeguard. `CLAUDE.md` tells Claude to run
  `npm run build` before pushing.
- There are no PR previews and no local preview (`amplify_outputs.json` is gitignored), so
  Chris verifies on the live site after pushing.
- This departs from the "no direct commits to `main`" rule in your global instructions;
  that rule still applies to your own work.
- Chris (`WellcommandChris`) already has write access. His commits will show under his own
  GitHub name, which makes `git log` a clear audit trail of who changed what.
- [`CLAUDE.md`](../CLAUDE.md) carries the plain-English operating rules for Chris's sessions.
