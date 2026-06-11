import type { ErrorEntry } from './storage'

// The "redo my misses" graduation rule, as a pure function so it can be tested:
//   - a miss puts the question in the log (active) and resets its streak
//   - a correct answer extends the streak; the SECOND consecutive correct
//     answer graduates the question out of the log
export function nextErrorEntry(cur: ErrorEntry | undefined, correct: boolean, now: number): ErrorEntry {
  const base = cur ?? { consecutiveCorrect: 0, active: false, lastMissTs: 0 }
  if (correct) {
    const cc = base.consecutiveCorrect + 1
    return { consecutiveCorrect: cc, active: base.active && cc < 2, lastMissTs: base.lastMissTs }
  }
  return { consecutiveCorrect: 0, active: true, lastMissTs: now }
}
