# SAT Sprint — QA Report

**Version:** 1.0.1 · **Release date:** 2026-06-10 (v1.0.0 audited 2026-06-09; Section 8 covers the v1.0.1 pass)
**Scope:** Full question bank (52 items), all user flows, build/deploy artifacts, and documentation.

---

## 1. Scope & method

Quality was verified along three independent tracks:

1. **Automated gates** — TypeScript strict typecheck, production build, and a structural validation script that checks every question in the bank against the data contract. All three run from a single `npm` command each and exit non-zero on any failure.
2. **Multi-agent content and code audit** — four parallel auditors (math content, Reading & Writing content, code, README/copy) reviewed the full deliverable. Every candidate finding was then adversarially verified by two further independent agents — one checking factual accuracy of the finding, one checking the proposed fix — before being accepted. Findings that did not survive both checks were discarded.
3. **Manual browser verification** — every user-facing flow was exercised by hand in a real browser, in both light and dark mode, including persistence across page reloads and serving the production build over localhost and LAN.

There is no automated UI test suite; manual verification plus the structural gate are the coverage for runtime behavior (see Section 6). *(v1.0.1 adds a fourth automated gate — a 46-test unit suite over the core logic; see Section 8.)*

## 2. Automated gates

All three gates were re-run on the release source on 2026-06-09 and pass.

| Gate | Command | Result | What it checks |
|---|---|---|---|
| Typecheck | `npm run typecheck` | Pass (exit 0) | `tsc --noEmit` under strict mode across the whole source tree |
| Build | `npm run build` | Pass (exit 0) | `tsc` + `vite build`; output 280.54 kB JS (86.65 kB gzipped), 23.80 kB CSS |
| Bank validation | `npm run validate` | Pass (exit 0) | Structural gate over all 52 questions (details below) |

**What `npm run validate` checks** (`scripts/validate-questions.mjs`), per question:

- Unique `id`
- Known skill, and `section` (`rw`/`math`) matches that skill's section
- Valid `difficulty` (`easy`/`medium`/`hard`) and `type` (`mcq`/`grid`)
- Non-empty `prompt`, `explanation`, and `trap`
- MCQ: exactly 4 unique choices, with `answer` exactly matching one of them
- Grid-in: no choices, and `answer` parses as a number or fraction (mirrors the app's `parseGrid`, including decimals and unicode minus)

Plus one bank-wide check: every one of the 8 SAT skills has at least one question. Current run confirms the intended distribution — Information and Ideas 9, Craft and Structure 9, Expression of Ideas 5, Standard English Conventions 14, Algebra 4, Advanced Math 3, Problem-Solving and Data Analysis 4, Geometry and Trigonometry 4 (52 total).

## 3. Content audit

Both content audits covered the entire 52-question bank and returned **zero findings**.

- **Math (15 items):** the math auditor re-solved every item from scratch, independently of the keyed answers and explanations. All keys, explanations, and trap notes verified correct. **Clean.**
- **Reading & Writing (37 items):** the RW auditor verified that each item has a single defensible keyed answer (no second choice is arguably correct) and that prompt, choice, and explanation copy are error-free. **Clean.**

All questions are original, written to match Digital SAT format and difficulty; nothing is copied from College Board materials.

## 4. Code & docs audit findings

The code and documentation auditors produced 8 confirmed findings. Each passed adversarial verification, and every fix has been applied and re-verified in the release build.

| # | Severity | Issue | Resolution |
|---|---|---|---|
| 1 | Medium | AI-generated grid questions with non-numeric answers (e.g. `x = 5`) were accepted into the bank, creating permanently unanswerable questions stuck in the error log | `normalizeQuestion` now rejects grid answers that don't parse (`parseGrid === null`) |
| 2 | Medium | README claimed Node 18+, but Vite 8 requires Node 20.19+ / 22.12+ | README requirement corrected |
| 3 | Medium | Settings footer claimed "100% offline · progress never leaves this browser", contradicting optional AI mode behavior | Footer (and `index.html` meta) reworded: no backend; progress stored only in this browser; AI mode calls Anthropic directly |
| 4 | Low | "Targeted drill" subtitle hardcoded "8 questions", but math skills have only 3–4 items in the bank | Subtitle now shows the real set size: `min(8, available)` |
| 5 | Low | Settings dropdown used dated model id `claude-haiku-4-5-20251001` while README said `claude-haiku-4-5` | Switched to the recommended alias `claude-haiku-4-5`; README and code now agree |
| 6 | Low | README didn't mention the `npm run validate` quality gate | Added to Quick start and the add-your-own-questions steps |
| 7 | Low | Home headline said "Let's sharpen Reading & Writing." though the app covers the full SAT | Headline now "Let's sharpen your Digital SAT score." |
| 8 | Low | (Found during initial build) Summary's "Drill your weakest" launched into a stale finished state; a conventions item duplicated a word when its answer was substituted into the sentence | Quiz runner remounts per session (`key` prop); prompt text fixed |

## 5. Manually verified user flows

Each flow below was exercised by hand in a browser against the release build.

- ✓ **MCQ flow** — choices lock after answering; correct turns green; chosen wrong turns red; explanation and trap cards render; Next advances
- ✓ **Grid-in flow** — wrong answer marked red with the correct answer shown; correct answer accepted; fraction/decimal equivalence (3/4 = 0.75) handled by the matcher
- ✓ **Set summary** — correct score and accuracy; by-skill bars; weakest skill highlighted; "Drill your weakest" starts a fresh set at question 1
- ✓ **Diagnostic** — 15 mixed questions covering every skill
- ✓ **Error log** — a miss is auto-added (nav badge appears); 1 correct answer shows 1/2 progress dots and the item stays; a 2nd consecutive correct answer graduates it out (badge clears, empty state shown)
- ✓ **Dashboard** — answered count, accuracy %, misses-to-clear, and weakest-skill callout all correct and persist across page reloads
- ✓ **Targeted drill** — subtitle shows the real set size (verified: 3 for Advanced Math, 8 for Standard English Conventions)
- ✓ **Dark mode** — toggle works, persists, no flash on reload; light and dark both readable
- ✓ **Settings** — AI mode fields hidden until enabled; security warning visible; reset-with-confirmation wipes attempts and error log but keeps settings
- ✓ **Build artifacts** — production `dist/` serves correctly (HTTP 200 on localhost and LAN IP, over both IPv4 and IPv6)

## 6. Known limitations & residual risks

- **No automated UI test suite.** Runtime behavior is covered by manual verification plus the structural `validate` gate only. Regressions in interaction logic would not be caught automatically.
- **Client-side API key (AI mode).** The optional AI mode stores the Anthropic API key in `localStorage` and calls `api.anthropic.com` directly from the browser. This is acceptable for personal/local use only; a publicly deployed copy would expose the key. A prominent in-app warning states this. AI mode is off by default and the app is fully functional without it.
- **Small math bank.** 3–4 questions per math skill (15 total). This is by design — Reading & Writing is the student's priority — but math drills repeat quickly.
- **Single-device storage.** All progress lives in `localStorage`; there is no sync, export, or backup. Clearing browser data loses progress.
- **localStorage capacity.** Browser quota (typically ~5 MB) bounds the bank plus attempt history; not a practical concern at current size, but heavy AI question generation over time would eventually approach it.
- **No timed/exam mode or spaced-repetition scheduling** yet.

## 7. Release verdict

**Ready for release for personal and internal use.** All automated gates pass, the content audit is clean across all 52 items, all 8 code/docs findings are fixed and re-verified, and every user flow passed manual verification.

**Condition for public deployment:** move AI-mode calls behind a server-side proxy so the API key never reaches the browser. Static hosting of the core app (Netlify/Vercel/GitHub Pages) is fine with AI mode left disabled.

## 8. v1.0.1 — pre-domain perfection pass (2026-06-10)

A second, deeper review before pointing a public domain at the app: six parallel reviewers (UX behavior & copy, accessibility, code robustness, Reading & Writing fidelity to real Digital SAT conventions, Math fidelity, deploy-readiness), with adversarial verification of findings. The pass produced **47 findings: 37 verified and fixed, 7 rejected or deferred**. (Three findings were verified by two independent agents each; the remainder were verified by direct maintainer review against the source after the verification fleet hit a rate limit.)

**New automated gate.**

| Gate | Command | Result | What it checks |
|---|---|---|---|
| Unit tests | `npm test` | Pass — 46 tests, 5 files | Grid-in matcher (fraction/decimal/negative/comma equivalence), stats & weakest-skill tie-breaking, set selection (diagnostic coverage, no duplicates), the error-log graduation rule (`src/lib/errorLog.ts`, extracted pure), and the AI question validator (`normalizeQuestion`, `extractJsonArray`) |

All four gates re-run clean on the v1.0.1 source (typecheck, build, validate, test).

**Highlights of what was fixed** (full list in RELEASE_NOTES.md): mobile scroll reset on question advance; screen-reader result announcements + focus management; WCAG AA contrast on light-mode secondary text; `prefers-reduced-motion`; real-test grid-in keypad behavior and comma/dollar tolerance in the matcher; official Digital SAT stem wording (Words-in-Context "word or phrase", Command of Evidence phrasing, rhetorical-synthesis boilerplate); superscript notation (cm², x²); four difficulty recalibrations; corrupt-localStorage guards; StrictMode-safe persistence with cross-tab sync; schema versioning; human-readable AI error messages; stricter AI question validation; PWA icons + manifest; social metadata; subpath-safe relative asset paths.

**Rejected/deferred, with reasons:**
- *Embed each Standard English Conventions item in a 25–150-word passage* — real-test convention, but rewriting 14 prompts requires a fresh content audit; deferred to the content-expansion phase.
- *Replace "most strongly supported" inference stems* — rejected: that stem does appear on official Digital SAT inference items.
- *Accept truncated/rounded non-terminating decimals in grid-ins* — deferred: no current question has a non-terminating answer; revisit when one does.
- *Cross-tab conflict resolution beyond last-write-wins* — partially addressed (storage-event sync); full merge semantics unnecessary for a single-user app.

**Manual re-verification (browser, desktop + 375px mobile viewport):** superscripts render in choices and explanations; difficulty chips capitalized; progress bar fills on answer lock; "Tough set" tier appears at 0%; Misses tab/screen naming consistent; input filter strips invalid grid characters; correct answers announced via the live region; manifest, favicon.png, and apple-touch-icon served (HTTP 200); theme-color follows the active theme.
