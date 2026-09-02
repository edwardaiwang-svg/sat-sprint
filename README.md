# SAT Sprint — personalized Digital SAT prep

A calm, fast, 100% client-side practice app for raising a Digital SAT score. Short
interactive sets, instant feedback, and **teaching explanations** (the rule + a quick
test to apply), with an error log that makes you re-prove every miss.

Built with **React + Vite + TypeScript + Tailwind CSS**. No backend, no login — all
progress is saved in your browser's `localStorage`, so it survives refreshes. Works
great on a phone and supports light/dark mode.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL it prints (usually <http://localhost:5173>).

To make a production build: `npm run build` then `npm run preview`.
To check the question bank: `npm run validate` (the pre-release quality gate).
To run the unit tests: `npm test` (46 tests: grid-in matching, stats/weakest-skill, set selection, error-log graduation).
Typecheck: `npm run typecheck`.

> **Requirements:** Node 20.19+ or 22.12+ (required by Vite 8).

---

## How to use (5 lines)

1. **Diagnostic** — tap *Take a diagnostic* for a 15-question mixed quiz that finds your weak spots.
2. **Practice** — pick any skill (or *Mixed practice*); answer, get instant feedback, read the rule, hit Next.
3. **Redo my misses** — every question you miss is saved automatically; it clears only after you get it right **twice in a row**.
4. **Progress** — the Progress tab shows accuracy per skill and highlights your weakest area; tap *Drill it*.
5. **Targeted drill** — one tap on the Home screen generates a focused set on your current weakest skill.

Everything is saved on this device. Use **Settings → Reset all progress** to start fresh.

---

## How to add your own questions (5 lines)

1. Open [`src/data/questions.ts`](src/data/questions.ts).
2. Copy an existing object in the `SEED_QUESTIONS` array and edit it.
3. Give it a unique `id`, set the `skill` to one of the 8 official skills (see below), and pick `type: "mcq"` or `"grid"`.
4. For `mcq`, provide 4 `choices` and make `answer` the **exact text** of the correct choice. For `grid`, omit `choices` and set `answer` to the numeric answer as a string (e.g. `"-3"`, `"3/4"`).
5. Write an `explanation` that teaches the **rule + a quick test**, and a `trap` naming the mistake the wrong answers cause. Save, then run `npm run validate` — it checks every question (unique id, valid skill, 4 unique choices with a matching answer, numeric grid answers) before you ship.

### The `Question` shape

```ts
{
  id: string,
  section: "rw" | "math",
  domain: string,        // short sub-skill label shown as a chip, e.g. "Sentence boundaries"
  skill: string,         // one of the 8 skills below — this drives the dashboard
  difficulty: "easy" | "medium" | "hard",
  type: "mcq" | "grid",
  prompt: string,        // use "\n\n" to separate a passage from the question stem
  choices?: string[],    // exactly 4 for mcq; omit for grid
  answer: string,        // mcq: exact correct choice text · grid: numeric answer as a string
  explanation: string,   // teach the RULE and a quick test/habit
  trap: string           // name the mistake the wrong answers are designed to cause
}
```

### The 8 skills (tag every question with one)

**Reading & Writing:** `Information and Ideas` · `Craft and Structure` · `Expression of Ideas` · `Standard English Conventions`

**Math:** `Algebra` · `Advanced Math` · `Problem-Solving and Data Analysis` · `Geometry and Trigonometry`

> The seed bank ships with **52 original questions** spread across all 8 skills, deliberately
> weighted toward the conventions/words-in-context/inference and math unit-conversion & slope
> areas. They match the real Digital SAT's format and difficulty but are **not** copied from
> College Board materials.

---

## Optional AI mode (off by default)

The app is fully functional without AI. If you want unlimited fresh questions and an
AI tutor, go to **Settings → AI mode**:

- Paste an **Anthropic API key** (stored only in your browser's `localStorage`).
- Then you can: **generate** new questions for any skill/difficulty (added to your bank),
  get a **re-explanation** of anything you missed with a brand-new example, and **grade**
  a short free-response answer.
- Default model: `claude-sonnet-4-6` (balanced). You can switch to `claude-haiku-4-5` for
  cheaper/faster generation.

> ⚠️ **Personal / local use only.** A key placed in the browser is visible to anyone who can
> read the page. **Never deploy a public website with your API key in the client.** For a real
> deployment, move these calls to a small backend that keeps the key secret.

---

## Project structure

```
src/
  data/questions.ts      # the 52-question seed bank (edit this to add your own)
  types.ts               # the Question type
  lib/
    taxonomy.ts          # the 8 skills
    storage.ts           # localStorage read/write
    stats.ts             # accuracy + weakest-skill math
    select.ts            # builds each mode's question set (diagnostic, drill, ...)
    grid.ts              # grid-in answer matching (fractions/decimals)
    claude.ts            # optional Anthropic API calls
  state/AppState.tsx     # global state + persistence (the useApp() hook)
  components/            # QuestionRunner, SetSummary, SkillBars, Explanation, ...
  screens/               # Home, Dashboard, ErrorLog, Settings
```

---

## How progress works

- Every answer is recorded as an `Attempt` (used for per-skill accuracy).
- A miss puts the question in your **error log**; it graduates out after **2 correct in a row**.
- Your **weakest skill** is the lowest-accuracy skill you've attempted (ties go to the one with
  more attempts), and it drives the *Targeted drill* button.

## Docs

- [`docs/PRODUCT_OVERVIEW.md`](docs/PRODUCT_OVERVIEW.md) — what it is, design rationale, question-bank weighting
- [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) — a 5-minute walkthrough
- [`docs/QA_REPORT.md`](docs/QA_REPORT.md) — the release gates and what they check
- [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md)
- [`docs/COMMERCIALIZATION.md`](docs/COMMERCIALIZATION.md) · [`docs/COMPETITORS.md`](docs/COMPETITORS.md) — market notes (June 2026)

## License and trademark

MIT — see `LICENSE`. SAT® is a trademark registered by the College Board, which is not
affiliated with, and does not endorse, this project. No College Board material is used;
every question in the seed bank is original.

Enjoy the climb to 1560+. 📈
