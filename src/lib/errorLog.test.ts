import { describe, it, expect } from 'vitest'
import { nextErrorEntry } from './errorLog'

// The "redo my misses" graduation rule — the app's most important behavior.

describe('nextErrorEntry', () => {
  it('a miss puts the question into the log', () => {
    const e = nextErrorEntry(undefined, false, 100)
    expect(e.active).toBe(true)
    expect(e.consecutiveCorrect).toBe(0)
    expect(e.lastMissTs).toBe(100)
  })

  it('one correct answer keeps it in the log (1/2)', () => {
    const missed = nextErrorEntry(undefined, false, 100)
    const oneRight = nextErrorEntry(missed, true, 200)
    expect(oneRight.active).toBe(true)
    expect(oneRight.consecutiveCorrect).toBe(1)
  })

  it('two correct in a row graduates it out', () => {
    const missed = nextErrorEntry(undefined, false, 100)
    const oneRight = nextErrorEntry(missed, true, 200)
    const twoRight = nextErrorEntry(oneRight, true, 300)
    expect(twoRight.active).toBe(false)
    expect(twoRight.consecutiveCorrect).toBe(2)
  })

  it('a miss after one correct resets the streak', () => {
    const missed = nextErrorEntry(undefined, false, 100)
    const oneRight = nextErrorEntry(missed, true, 200)
    const missAgain = nextErrorEntry(oneRight, false, 300)
    expect(missAgain.active).toBe(true)
    expect(missAgain.consecutiveCorrect).toBe(0)
    expect(missAgain.lastMissTs).toBe(300)
    // ...and graduation now needs two MORE consecutive corrects.
    const right1 = nextErrorEntry(missAgain, true, 400)
    expect(right1.active).toBe(true)
    const right2 = nextErrorEntry(right1, true, 500)
    expect(right2.active).toBe(false)
  })

  it('correct answers on a never-missed question never activate the log', () => {
    const r1 = nextErrorEntry(undefined, true, 100)
    expect(r1.active).toBe(false)
    const r2 = nextErrorEntry(r1, true, 200)
    expect(r2.active).toBe(false)
  })

  it('a re-missed graduated question re-enters the log', () => {
    const graduated = { consecutiveCorrect: 2, active: false, lastMissTs: 100 }
    const reMissed = nextErrorEntry(graduated, false, 900)
    expect(reMissed.active).toBe(true)
    expect(reMissed.consecutiveCorrect).toBe(0)
  })
})
