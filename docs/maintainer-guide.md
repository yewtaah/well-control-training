# 📘 Maintainer's Guide

**Keeping the Well Command training site up to date — using only Claude and GitHub.**

Written for Chris Scarborough. No coding, no VS Code, no command line. You describe
the change you want in plain English; Claude makes it; you check it and publish it.

---

## 🧭 The big picture

```
 You ──► Claude Code Desktop ──► GitHub ──► Live website
 say what     makes the change    holds the     rebuilds itself
 you want     and proposes it     proposal      in ~5–10 minutes
                                  (a "pull       after you approve
                                   request")
```

| Piece | What it is | Your job |
|-------|-----------|----------|
| **Claude Code Desktop** | The Claude app, **Code** tab. It reads the site's files and edits them for you. | Describe changes. Read what it proposes. |
| **GitHub** | Where the site's files live, with a full history of every change. | Review the proposed change, then press **Merge**. |
| **The live site** | Rebuilds automatically a few minutes after you merge. | Check it looks right. |

**The one rule:** nothing reaches the live site until *you* press **Merge** on GitHub.
Everything before that is a draft you can throw away.

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

Every change follows the same five steps.

### Step 1 · Open the project
Open the Claude app → **Code** tab → pick **well-control-training**.

### Step 2 · Describe the change, and say "use a branch and open a pull request"
Always include that phrase. It keeps your change as a safe draft.

> **Example:**
> In the *Well Kill Methods* course, add a case history about the Piper Alpha
> disaster at the end of the first lesson. Here is the text: *[paste your text]*.
> Make this change on a new branch and open a pull request.

Tips for good requests:
- Name the **course** and **lesson** (use the titles you see on the site).
- **Paste your exact wording** if you have it. Otherwise say "draft something and I'll edit it".
- **One topic per request.** Small changes are easier to check and undo.

### Step 3 · Read what Claude did
Claude will summarise its change and give you a link to a **pull request** on
GitHub. Ask it follow-ups freely:
> Show me exactly what text you changed.
> Does this change anything other than lesson text?

### Step 4 · Review on GitHub and merge
1. Open the link Claude gave you.
2. Click the **Files changed** tab. 🟩 **Green** lines are added, 🟥 **red** lines are removed.
   For text changes, just check the wording reads the way you want.
3. Happy? Click **Merge pull request → Confirm merge**.
4. Not happy? Go back to Claude and say what to fix — it updates the same pull
   request. Or click **Close pull request** to throw the draft away. Nothing is lost.

### Step 5 · Check the live site
The site rebuilds automatically. Wait about **5–10 minutes**, then refresh the
site and look at your change.

> If it looks wrong, jump to [🆘 Undoing a mistake](#-undoing-a-mistake).

---

## 🗂️ Part 3 — Common jobs, with ready-to-paste requests

All the course content — lessons, summaries, and knowledge checks — lives in one
file, `src/lib/curriculum.ts`. You never need to open it; Claude does.

### 📝 Edit lesson text
> In the *Pressure Fundamentals* course, lesson *Hydrostatic Pressure*, replace the
> second paragraph with this text: *[paste]*. Use a branch and open a pull request.

### 🏗️ Add a case history
> Add a case history to the lesson *[lesson title]* in *[course title]*. Title it
> "Case History: [name]". Use this material: *[paste notes]*. Keep my facts exactly as
> written. Use a branch and open a pull request.

### ✅ Change or add knowledge-check questions
Each course ends with a knowledge check. Every question has a prompt, answer
options, the correct answer, and an explanation shown after submitting.

> In the *[course title]* knowledge check, add a question: *"[question]"* with
> options A) … B) … C) … D) …. The correct answer is *[letter]*. The explanation
> is: *[text]*. Use a branch and open a pull request.

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

## ✅ Part 4 — Before you merge: a 60-second checklist

- [ ] The **Files changed** tab shows only the lessons/questions I meant to change.
- [ ] My wording, numbers, and units are exactly right (Claude can slip on technical facts — **you are the subject-matter expert**).
- [ ] For a knowledge-check question: exactly one correct answer, and the explanation matches it.
- [ ] Nothing about sign-in, accounts, or settings was touched. (If it was, stop and ask Scott.)

> 🧠 **Important:** Claude is a fast writer, not a well-control authority. Anything
> technical that Claude drafts from its own knowledge — rather than from your text —
> must be checked by you before merging.

---

## 🆘 Undoing a mistake

You cannot permanently break the site: GitHub keeps every version.

| Situation | What to do |
|-----------|-----------|
| **Haven't merged yet** | Close the pull request on GitHub. Nothing changed. |
| **Merged, and the live site looks wrong** | In Claude: *"Undo my last merged pull request. Use a branch and open a pull request."* Merge that one. The site goes back to how it was. |
| **Claude is confused or went off track** | Start a **new** conversation in the Code tab and say what you want again. |
| **Anything involving sign-in, emails, the database, or AWS** | Stop. Message Scott. |

---

## 🧩 What *not* to ask Claude to do

Content changes are safe. Leave these to Scott:

- ❌ Changing sign-in, accounts, or the admin dashboard
- ❌ Changing the AWS setup, email sending, or the database
- ❌ Deleting the repository, or "force-pushing"
- ❌ Merging without reading the **Files changed** tab

---

## 💬 Quick reference

| I want to… | Say to Claude |
|-----------|---------------|
| Change some wording | "In *[course]*, lesson *[lesson]*, change … to …. Use a branch and open a pull request." |
| Add a case history | "Add a case history to *[lesson]* … Use a branch and open a pull request." |
| Add a quiz question | "In the *[course]* knowledge check, add a question … Use a branch and open a pull request." |
| See what Claude changed | "Show me exactly what you changed." |
| Revise a draft | "Update the same pull request: …" |
| Undo a merged change | "Undo my last merged pull request. Use a branch and open a pull request." |

**Stuck?** Contact Scott, and send him the link to the pull request or a screenshot of what you see.

---

## 🧑‍💻 Notes for Scott (not for Chris)

- Chris (`WellcommandChris`) is already a collaborator with write access. `main` is **not**
  branch-protected, so nothing technically stops a direct push. Consider enabling
  *Require a pull request before merging* so the rule in this guide is enforced.
- Amplify builds only `main`. There are **no PR preview builds**, and
  `amplify_outputs.json` is gitignored, so Chris cannot run the site locally. The guide
  therefore tells him to verify on the live site after merging. Enabling PR previews on the
  Amplify app would let him check a change *before* merging.
- Content changes only touch `src/lib/curriculum.ts`; they do not redeploy the backend in a
  meaningful way, but every merge to `main` still runs `ampx pipeline-deploy`.
- [`CLAUDE.md`](../CLAUDE.md) carries plain-English operating rules so Claude follows this guide's
  workflow (branch + PR, explain in plain language, refuse backend changes) in Chris's sessions.
