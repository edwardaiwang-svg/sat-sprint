# SAT Sprint — 5-Minute Demo Guide

A scripted walkthrough anyone can run for stakeholders. No knowledge of the codebase required. Total time: about 5 minutes.

## Prerequisites

- **Node 20.19+ or 22.12+** (required by Vite 8). Check with `node --version`.
- From the repo root:

  ```sh
  npm install
  npm run dev
  ```

- Open **http://localhost:5173** in a browser.
- The dev server listens on all interfaces (`host: true`), so the terminal also prints a **Network URL** (e.g. `http://192.168.x.x:5173`). Open that on a phone on the same Wi-Fi if you want to demo the mobile-first layout on a real device — the app is designed for it.

**Tip:** if the machine has been used for testing before, reset state first (Settings → Reset all progress) so the demo starts from a clean slate.

**Do not enter a real API key during the demo.** The AI mode section is shown, not exercised.

## Minute-by-minute script

### Minute 0:00 — Home and the diagnostic (beats 1)

1. Start on **Home**. Point out the headline, the snapshot row (Answered / Accuracy / Misses to clear), and the four primary actions. Note the "Practice by skill" list below covers all 8 Digital SAT skill areas — 52 original questions, deliberately weighted toward Reading & Writing.
2. Tap **Take a diagnostic** ("15 mixed questions · finds your weak spots"). Explain: this is how a new student starts — it samples every skill in the bank, then recommends what to drill.

### Minute 0:45 — The teaching loop: answer an MCQ wrong on purpose (beat 2)

3. On the first multiple-choice question, **deliberately pick a wrong answer**. Show what happens:
   - Choices **lock** — no changing your answer after the fact.
   - The correct choice turns **green**; your chosen wrong answer turns **red**.
   - An **explanation card** appears with the underlying rule and a quick test you can reuse.
   - A **named trap card** identifies the specific mistake the wrong answer was designed to bait.
4. Point out the progress bar and running score at the top, then tap **Next**.

### Minute 1:45 — A grid-in (student-produced response) question (beat 3)

5. Continue until a math **grid-in** appears (no answer choices — you type the answer). Answer it; mention that the matcher accepts fraction/decimal equivalents (3/4 and 0.75 both count). If you answer wrong, the correct answer is shown in red, same teaching loop as MCQ.
6. Answer the remaining questions briskly — get a few wrong on purpose so the error log has material for beat 5.

### Minute 3:00 — Set summary and "Drill your weakest" (beat 4)

7. At the end of the set, show the **summary**: score, accuracy, and per-skill bars for this set.
8. Point to the one-tap **"Drill your weakest"** recommendation — tap it. It builds a fresh targeted set on the weakest skill, starting at question 1. Answer one question, then exit back out (no need to finish).

### Minute 3:45 — Error log and the 2-in-a-row graduation rule (beat 5)

9. Open the **Misses** tab — note the **badge count** in the nav. Every question missed during the demo was auto-saved here.
10. Explain the graduation rule: a question only clears after **2 correct answers in a row**. Show the per-question **progress dots** (0/2, 1/2). Tap **Redo my misses**, answer one correctly, and return to show its dot advance to 1/2. One wrong answer resets the streak.

### Minute 4:15 — Progress dashboard and dark mode (beat 6)

11. Open the **Progress** tab: per-skill accuracy bars (color-coded), with the **weakest skill highlighted** and a one-tap drill button. Refresh the page (F5) to show that everything persists — all state lives in localStorage, no backend.
12. Toggle **dark mode** from the header. Reload once more: no flash of the wrong theme on first paint, and the preference sticks.

### Minute 4:45 — Settings and optional AI mode (beat 7)

13. Open **Settings**. Show:
    - **AI mode is OFF by default** and the app is fully functional without it. Toggling it on reveals the API key and model fields (Claude Sonnet default, Haiku selectable) — **do not enter a real key**.
    - The prominent **security warning**: the key lives in browser localStorage and is sent directly to api.anthropic.com — personal/local use only; never deploy publicly with a client-side key.
    - When enabled, AI mode can generate fresh validated questions, re-explain a missed concept with a new example, and grade a short free-response answer.
    - The footer: version number, and the storage statement (no backend; progress stays in this browser).
14. Close on the **Reset all progress** button (with confirmation) — wipes attempts and the error log, keeps settings. Don't press it unless you want to end on a clean slate.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| **Port already in use** (`Port 5173 is in use`) | Vite automatically tries the next free port — check the terminal for the actual URL. Or free the port: `lsof -ti:5173 \| xargs kill`. |
| **localhost doesn't load** | The Vite config sets `host: true`, so the server listens on all interfaces — IPv4 and IPv6 both work (`http://localhost:5173`, `http://127.0.0.1:5173`, and `http://[::1]:5173`). If one form fails in your browser, try another, or use the Network URL from the terminal. |
| **Node version error** (`npm install` or `npm run dev` fails citing engines/`crypto.hash`/syntax errors) | Vite 8 requires **Node 20.19+ or 22.12+**. Check `node --version` and upgrade (e.g. `nvm install 22`). |
| **Stale or weird state from a previous run** | Settings → **Reset all progress** (clears attempts and error log, keeps settings). For a full wipe, clear the `sat.*` localStorage keys in DevTools (Application → Local Storage): `sat.attempts`, `sat.errorLog`, `sat.customQuestions`, `sat.settings`, `sat.theme`. |
| **Phone can't reach the Network URL** | Phone and laptop must be on the same Wi-Fi; some networks block device-to-device traffic (guest/corporate isolation). Fall back to demoing mobile layout via browser DevTools device mode. |
