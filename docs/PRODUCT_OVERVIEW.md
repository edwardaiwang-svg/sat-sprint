# SAT Sprint — Product Overview

**Version 1.0.0 · Released 2026-06-09**

This is the entry point to the documentation set. Companion documents: [DEMO_GUIDE.md](DEMO_GUIDE.md) (a guided tour), [RELEASE_NOTES.md](RELEASE_NOTES.md), and [QA_REPORT.md](QA_REPORT.md) (quality gates, audit, and manual verification detail).

---

## 1. Executive summary

SAT Sprint is a personalized Digital SAT practice web app built for one student: currently scoring around 1500 (Reading & Writing 710, Math 790) and aiming for 1560+. Because nearly all of the headroom is in Reading & Writing, the app is deliberately weighted toward that section and, within it, toward the student's specific recurring mistakes. It ships with 52 original questions across all 8 official Digital SAT skill areas, plus practice, diagnostic, error-log, and progress-tracking features that adapt to where the student is actually losing points. The app is 100% client-side — React + Vite + TypeScript, all state in localStorage, no backend, no login, no analytics. An optional AI mode (off by default) can generate new questions, re-explain missed concepts, and grade free-response answers via the Anthropic API. Version 1.0.0 is feature-complete for its scope: all quality gates pass, a multi-agent content audit came back clean, and the full feature set has been manually verified.

## 2. The user and the problem

The user is a single student preparing for the Digital SAT, sitting at roughly 1500 with a 710/790 split between Reading & Writing and Math. To reach 1560+, the gains have to come mostly from RW, and within RW from a known list of weak spots rather than generic practice volume.

Those weak spots drive the design:

- **Reading & Writing:** Standard English Conventions (essential commas, comma splices and sentence boundaries, subject-verb agreement across interrupters, modifiers), Words in Context, and "most strongly supported" inference questions.
- **Math:** unit/area conversion mistakes and slope sign errors — careless-error patterns rather than concept gaps, which is why the math bank is intentionally small.

Generic SAT apps spread practice evenly across all skills. SAT Sprint instead concentrates question volume on the weak skills, names the specific trap each wrong answer is designed to spring, and continuously steers the student toward whichever skill their own accuracy data says is weakest.

## 3. Feature walkthrough

In the order a user encounters them:

**Practice mode.** One question at a time. Choices lock as soon as an answer is selected; the correct choice turns green and a wrong selection turns red. Every question then shows a teaching explanation — the underlying rule plus a quick test the student can reuse — and a named trap describing the mistake the wrong answers were built to cause. A progress bar and running score sit above the question.

**Set summary.** At the end of a set: score, accuracy, per-skill bars for the set, and a one-tap "Drill your weakest" button that immediately starts a fresh set on the lowest-accuracy skill.

**Diagnostic.** A 15-question mixed quiz that covers every skill in the bank, then recommends the next drill based on the results. This is the intended starting point for a new user.

**Error log ("Redo my misses").** Every missed question is saved automatically, and a badge count in the nav shows how many are outstanding. A question only graduates out of the log after two correct answers in a row; per-question progress dots show how close each item is to clearing. This is the app's retention mechanism — misses are not allowed to disappear after one lucky retry.

**Progress dashboard.** Per-skill accuracy bars (color-coded) computed from the full attempt history, with the weakest skill highlighted and a one-tap drill into it. All of it persists across page refreshes.

**Targeted drill.** One tap builds a practice set on the current weakest skill. Set size is min(8, questions available for that skill), and the subtitle shows the real number — e.g. 3 for Advanced Math, 8 for Standard English Conventions.

**Optional AI mode (off by default).** The app is fully functional without it. When enabled with a user-supplied Anthropic API key, it can: generate fresh questions for any skill/difficulty into the bank (validated on entry — an MCQ's answer must match one of its choices, a grid answer must parse as a number); re-explain a missed concept with a brand-new example; and grade a short free-response answer. Default model is claude-sonnet-4-6, with claude-haiku-4-5 selectable. The key is stored in localStorage and sent directly from the browser to api.anthropic.com; a prominent in-app warning marks this as personal/local use only (see section 7).

The app also includes the expected polish: mobile-first layout, dark mode with no first-paint flash, favicon, safe-area-aware bottom nav, and the version number in the Settings footer.

## 4. Content

The bank contains **52 original questions** spanning all 8 official Digital SAT skill areas:

| Section | Skill | Questions |
|---|---|---|
| Reading & Writing | Standard English Conventions | 14 |
| Reading & Writing | Information and Ideas | 9 |
| Reading & Writing | Craft and Structure | 9 |
| Reading & Writing | Expression of Ideas | 5 |
| Math | Algebra | 4 |
| Math | Problem-Solving and Data Analysis | 4 |
| Math | Geometry and Trigonometry | 4 |
| Math | Advanced Math | 3 |
| | **Total** | **52** |

**Weighting rationale.** The distribution is deliberately uneven. RW accounts for 37 of 52 questions because that is where the score gap is, and Standard English Conventions alone gets 14 because it is the student's single weakest area. Within skills, items target the documented mistake patterns: comma rules and sentence boundaries, agreement across interrupters, modifiers, Words in Context, "most strongly supported" inference, and in Math, unit/area conversions and slope signs. The small math bank (3–4 per skill) is a design decision, not an omission — Math is at 790 and only needs careless-error maintenance.

**Copyright stance.** All 52 questions are original items written to match the Digital SAT's format and difficulty. Nothing is copied from College Board materials.

## 5. Architecture and key decisions

**Stack:** React 19, Vite 8, TypeScript 6 (strict), Tailwind CSS 3. Two runtime dependencies (react, react-dom). Node 20.19+ or 22.12+ is required to build (a Vite 8 requirement).

**Client-side only, localStorage for all state.** There is no backend, no login, and no analytics. Attempts, the error log, custom questions, settings, and theme each live under a namespaced localStorage key. For a single-student personal tool this removes an entire class of work and risk — no accounts, no server costs, no data handling obligations — at the accepted cost of single-device progress (see section 8).

**Exact-text answers.** A question's `answer` field is the exact text of the correct choice (MCQ) or the numeric answer as a string (grid-in). Grading is exact comparison rather than index-based, which makes questions self-validating: the `npm run validate` gate rejects any MCQ whose answer doesn't match one of its 4 choices and any grid answer that doesn't parse as a number or fraction. The grid matcher accepts fraction/decimal equivalents (3/4 = 0.75). AI-generated questions pass through the same normalization, so a malformed generated question cannot enter the bank.

**Derived stats.** The app stores one immutable `Attempt` record per answered question and computes everything else — per-skill accuracy, overall accuracy, weakest skill — from that history on demand. There are no stored aggregates to drift out of sync. Weakest-skill ties break toward the skill with more attempts (higher confidence it's a real weakness), and before any data exists it falls back to the known #1 priority, Standard English Conventions.

**Error-log graduation rule.** A missed question stays in the error log until it has been answered correctly **twice in a row**; any new miss resets the streak. One correct answer after a miss is too often a coin flip, so the bar for "learned" is deliberately higher.

## 6. Quality status

All three quality gates pass: `npm run typecheck` (strict tsc), `npm run build` (tsc + vite build; ~280 kB JS, ~86 kB gzipped), and `npm run validate` (a structural gate over the entire question bank — unique ids, known skills, valid types, exact-match answers, full skill coverage). Content was checked by a multi-agent audit — four parallel auditors (math content, RW content, code, README/copy), with every finding adversarially verified by two independent agents before acceptance. The content result was clean: all 15 math items re-solved from scratch, all 37 RW items confirmed to have a single defensible keyed answer, zero content findings. The code/docs auditors raised 8 findings (3 medium, 5 low), all of which are fixed in this release. The full feature set was also manually verified end to end. Details, including each finding and its resolution, are in [QA_REPORT.md](QA_REPORT.md).

## 7. Running and deploying

```bash
npm install
npm run dev        # http://localhost:5173
```

The dev server runs with `host: true`, so it also prints a Network URL usable from a phone on the same Wi-Fi — useful since the app is mobile-first.

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Requires Node 20.19+ or 22.12+. The `dist/` output is fully static and deploys to any static host (Netlify, Vercel, GitHub Pages).

**Public-deployment caveat:** AI mode sends the Anthropic API key directly from the browser, which is acceptable only for personal/local use. Never deploy a build publicly with AI mode keys in use — anyone could extract the key. Static hosting of the core app (AI mode off) is fine; safe public AI mode would require a server-side proxy.

## 8. Roadmap candidates

None of these block the v1.0.0 deliverable; they are the natural next steps, roughly in value order:

- **Spaced repetition** — schedule error-log reviews over increasing intervals instead of relying on the student to revisit them.
- **Timed / exam mode** — module-style timing to build pacing, which raw practice mode doesn't exercise.
- **Larger math bank** — the current 3–4 questions per math skill are enough for error-pattern drilling but not for volume practice.
- **Server-side AI proxy** — a small backend holding the API key would make AI mode safe for public deployment.
- **Automated UI tests** — current coverage is the structural validate gate plus manual verification; a Playwright-style suite would protect the interactive flows against regressions.
- **Progress sync/export** — progress is currently single-device (localStorage only).
