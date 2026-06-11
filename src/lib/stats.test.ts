import { describe, it, expect } from 'vitest'
import { statsBySkill, weakestSkill, overallAccuracy, pct } from './stats'
import type { Attempt } from './storage'

// Helper: build an attempt with sensible defaults.
function att(skill: string, correct: boolean, ts = 0): Attempt {
  return { questionId: 'q', section: 'rw', skill, correct, ts }
}

describe('statsBySkill', () => {
  it('reports all 8 skills even with no attempts', () => {
    const rows = statsBySkill([])
    expect(rows).toHaveLength(8)
    for (const r of rows) {
      expect(r.total).toBe(0)
      expect(Number.isNaN(r.accuracy)).toBe(true)
    }
  })

  it('computes accuracy per skill', () => {
    const rows = statsBySkill([
      att('Algebra', true),
      att('Algebra', false),
      att('Algebra', true),
      att('Craft and Structure', false),
    ])
    const algebra = rows.find((r) => r.skill === 'Algebra')!
    expect(algebra.total).toBe(3)
    expect(algebra.correct).toBe(2)
    expect(algebra.accuracy).toBeCloseTo(2 / 3)
    expect(rows.find((r) => r.skill === 'Craft and Structure')!.accuracy).toBe(0)
  })
})

describe('weakestSkill', () => {
  it('falls back to the priority skill before any attempts', () => {
    expect(weakestSkill([])).toBe('Standard English Conventions')
  })

  it('returns the lowest-accuracy attempted skill', () => {
    const attempts = [att('Algebra', true), att('Craft and Structure', false)]
    expect(weakestSkill(attempts)).toBe('Craft and Structure')
  })

  it('breaks accuracy ties toward the skill with MORE attempts', () => {
    const attempts = [
      att('Algebra', false), // 0% on 1 attempt
      att('Expression of Ideas', false),
      att('Expression of Ideas', false), // 0% on 2 attempts — more evidence
    ]
    expect(weakestSkill(attempts)).toBe('Expression of Ideas')
  })

  it('ignores never-attempted skills (NaN accuracy)', () => {
    const attempts = [att('Algebra', true)]
    expect(weakestSkill(attempts)).toBe('Algebra')
  })
})

describe('overallAccuracy / pct', () => {
  it('is NaN with no attempts, and formats as a dash', () => {
    expect(Number.isNaN(overallAccuracy([]))).toBe(true)
    expect(pct(NaN)).toBe('—')
  })

  it('computes and formats a percentage', () => {
    const attempts = [att('Algebra', true), att('Algebra', false)]
    expect(overallAccuracy(attempts)).toBe(0.5)
    expect(pct(0.5)).toBe('50%')
    expect(pct(2 / 3)).toBe('67%')
  })
})
