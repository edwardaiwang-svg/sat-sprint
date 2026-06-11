# SAT Sprint — Release Notes

## v1.0.1 — 2026-06-10

Pre-domain "perfection pass": a six-lens deep review (UX copy, accessibility, code robustness, Reading & Writing fidelity, Math fidelity, deploy-readiness) produced 47 findings; 37 were verified and fixed, 7 were rejected or deferred with reasons recorded in the QA report.

**New quality gate.** `npm test` — a 46-test Vitest suite covering the grid-in answer matcher, stats/weakest-skill logic (including tie-breaking), set selection, the error-log graduation rule (extracted to a pure function), and the AI question validator.

**Fixed.**
- Mobile: advancing to the next question now scrolls to the top (previously kept the old scroll offset).
- Accessibility: results are announced to screen readers; focus moves to the new question on advance; the AI-mode toggle, theme buttons, nav tabs, and AI-lab fields have proper accessible names/states; light-mode contrast raised to AA on nav labels, counts, the trap label, and error text; `prefers-reduced-motion` honored.
- Grid-in input now mirrors the real test's keypad (digits, minus, slash, point; 5–6 characters) and the matcher tolerates thousands commas and dollar signs ("90,000", "$66").
- Content fidelity: official Digital SAT stem wording for Words-in-Context ("word or phrase"), Command of Evidence, and rhetorical-synthesis boilerplate; proper superscript notation (cm², x²); four miscalibrated difficulty labels corrected; geo-04 no longer gives away its own trap.
- Robustness: corrupt localStorage values can no longer white-screen the app; progress persists via effects (StrictMode-safe) and syncs across tabs; a schema-version key future-proofs migrations; AI errors are human-readable ("Invalid API key — check it in Settings."), and AI-generated questions are validated strictly (exactly 4 unique choices; numeric grid answers).
- Polish: the progress bar fills as each answer locks; the "Misses" tab and screen share one name; identical-looking miss previews differentiated; a fourth, honest encouragement tier for sub-40% sets; the dashboard no longer labels a 100% skill "weakest"; badge counts cap at 99+; difficulty chips are capitalized.
- Deploy-readiness: PNG favicon + apple-touch-icon + web app manifest (installable on a phone home screen); social share metadata; relative asset paths so the build works from any subpath; the browser-chrome color follows the theme.

## v1.0.0 — 2026-06-09

First release. A personalized Digital SAT practice web app built for a student raising a ~1500 (RW 710 / Math 790) toward 1560+, with Reading & Writing as the priority focus.

## Highlights

- **Teach-on-miss practice loop**: one question at a time; choices lock on answer; every question ships with a teaching explanation (rule + quick test) and a named trap.
- **Diagnostic → drill pipeline**: a 15-question mixed diagnostic finds weak spots, and the summary, dashboard, and home screen all offer a one-tap drill on the current weakest skill.
- **Error log with graduation**: every miss is auto-saved and only clears after 2 correct answers in a row, with per-question progress dots and a nav badge.
- **Zero infrastructure**: 100% client-side (React 19 + Vite 8 + TypeScript 6 + Tailwind 3); all state in localStorage; no backend, login, or analytics. ~280 kB JS (~86 kB gzipped).
- **Optional AI mode (off by default)**: generate validated new questions, re-explain missed concepts, and grade free-response answers via the Anthropic API — the app is fully functional without it.

## What's included

### Features

- **Practice mode** — single-question flow; correct answer turns green, a chosen wrong answer turns red; explanation and trap cards; progress bar and running score.
- **Set summary** — score, accuracy, by-skill bars, and a "Drill your weakest" recommendation.
- **Diagnostic** — 15 mixed questions covering every skill in the bank, ending with a recommended next drill.
- **Error log / Redo my misses** — auto-captured misses, 2-in-a-row graduation rule, progress dots, badge count in the nav.
- **Progress dashboard** — color-coded per-skill accuracy bars, weakest skill highlighted with a one-tap drill; persists across refreshes.
- **Targeted drill** — one tap builds a set on the current weakest skill; set size = min(8, questions available for that skill).
- **Polish** — mobile-first layout, dark mode with no first-paint flash, favicon, safe-area-aware bottom nav, version shown in the Settings footer.
- **AI mode (optional, off by default)** — generates fresh questions for any skill/difficulty into the bank (validated: an MCQ answer must match a choice; a grid answer must parse as a number), re-explains missed concepts with new examples, and grades short free-response answers. Default model claude-sonnet-4-6; claude-haiku-4-5 selectable. The API key is stored in localStorage and sent directly from the browser to api.anthropic.com — personal/local use only; public deployment would require a server-side proxy.

### Content

52 original questions, written to match the Digital SAT's format and difficulty (nothing copied from College Board materials), deliberately weighted toward the student's weak spots — Standard English Conventions (essential commas, comma splices/boundaries, subject-verb agreement across interrupters, modifiers), Words in Context, and "most strongly supported" inference; in Math, unit/area conversion and slope sign errors.

| Skill | Questions |
| --- | ---: |
| Information and Ideas | 9 |
| Craft and Structure | 9 |
| Expression of Ideas | 5 |
| Standard English Conventions | 14 |
| Algebra | 4 |
| Advanced Math | 3 |
| Problem-Solving and Data Analysis | 4 |
| Geometry and Trigonometry | 4 |

### Quality gates (all passing)

- `npm run typecheck` — tsc strict.
- `npm run build` — tsc + vite build; ~280 kB JS, ~86 kB gzipped.
- `npm run validate` — structural gate over the whole question bank: unique ids; known skill with matching section; valid difficulty/type; non-empty prompt/explanation/trap; MCQs have exactly 4 unique choices with the answer exactly matching one; grid answers parse as number/fraction; every one of the 8 skills covered.

In addition to the gates, the release was checked by a multi-agent audit (4 parallel auditors covering math content, RW content, code, and README/copy; every finding adversarially verified by 2 independent agents before acceptance). Content came back clean: all 15 math items re-solved from scratch, all 37 RW items verified to have a single defensible keyed answer and error-free copy. Manual verification covered the MCQ and grid-in flows, set summary, diagnostic, error-log graduation, dashboard persistence, drill set sizes, dark mode, settings/reset behavior, and serving the production build over localhost and LAN.

## Fixed during release hardening

Code and documentation findings from the audit, all resolved in this release:

- **[medium] AI question validation**: AI-generated grid questions with non-numeric answers (e.g. `x = 5`) were accepted, creating permanently unanswerable questions stuck in the error log. `normalizeQuestion` now rejects grid answers that don't parse.
- **[medium] Node requirement corrected**: README claimed Node 18+, but Vite 8 requires Node 20.19+/22.12+. README updated.
- **[medium] Accurate privacy copy**: the Settings footer claimed "100% offline · progress never leaves this browser," which contradicted optional AI mode behavior. Footer and index.html meta reworded: no backend; progress stored only in this browser; AI mode calls Anthropic directly.
- **[low] Honest drill sizing**: the "Targeted drill" subtitle hardcoded "8 questions," but math skills have only 3–4 in the bank. The subtitle now shows the real set size, min(8, available).
- **[low] Model id consistency**: the Settings dropdown used the dated id `claude-haiku-4-5-20251001` while the README said `claude-haiku-4-5`. Switched to the recommended alias; README and code now agree.
- **[low] Validate gate documented**: README didn't mention `npm run validate`. Added to Quick start and the add-your-own-questions steps.
- **[low] Headline scope**: Home said "Let's sharpen Reading & Writing." though the app covers the full SAT. Now "Let's sharpen your Digital SAT score."
- **[low] Stale session state** (found during initial build): the summary's "Drill your weakest" launched into a stale finished state, and a conventions item duplicated a word when its answer was substituted. The runner now remounts per session (key prop); the prompt text was fixed.

## Known limitations

- **No automated UI test suite** — coverage is manual verification plus the structural `npm run validate` gate.
- **AI mode uses a client-side API key** — personal/local use only; never deploy publicly with a key embedded.
- **Small math bank** (3–4 questions per math skill) — by design; Reading & Writing is the priority.
- **Single-device progress** — localStorage only; no sync or export.
- **No timed/exam mode or spaced-repetition scheduling** yet.

## Upgrade / compatibility notes

- First release — no upgrade path or migrations to consider.
- **Node 20.19+ or 22.12+ required** (Vite 8). Earlier Node versions will fail to install or run.
- Runs from any static host (Netlify/Vercel/GitHub Pages) for the core app; do not deploy publicly with AI mode keys.
