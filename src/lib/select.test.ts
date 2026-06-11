import { describe, it, expect } from 'vitest'
import { shuffle, bySkill, mixed, diagnostic, missed } from './select'
import { SEED_QUESTIONS } from '../data/questions'
import { ALL_SKILLS } from './taxonomy'

describe('shuffle', () => {
  it('returns a new array with the same members', () => {
    const input = [1, 2, 3, 4, 5]
    const out = shuffle(input)
    expect(out).not.toBe(input)
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5])
    expect(input).toEqual([1, 2, 3, 4, 5]) // input not mutated
  })
})

describe('bySkill', () => {
  it('only returns questions of the requested skill', () => {
    const set = bySkill(SEED_QUESTIONS, 'Algebra', 8)
    expect(set.length).toBeGreaterThan(0)
    for (const q of set) expect(q.skill).toBe('Algebra')
  })

  it('caps at the available pool size', () => {
    const advanced = SEED_QUESTIONS.filter((q) => q.skill === 'Advanced Math').length
    const set = bySkill(SEED_QUESTIONS, 'Advanced Math', 8)
    expect(set.length).toBe(Math.min(8, advanced))
  })
})

describe('mixed', () => {
  it('returns n unique questions', () => {
    const set = mixed(SEED_QUESTIONS, 10)
    expect(set).toHaveLength(10)
    expect(new Set(set.map((q) => q.id)).size).toBe(10)
  })
})

describe('diagnostic', () => {
  it('covers every skill present in the bank', () => {
    const set = diagnostic(SEED_QUESTIONS, 15)
    expect(set).toHaveLength(15)
    const skills = new Set(set.map((q) => q.skill))
    for (const s of ALL_SKILLS) expect(skills.has(s)).toBe(true)
  })

  it('never repeats a question', () => {
    for (let i = 0; i < 20; i++) {
      const set = diagnostic(SEED_QUESTIONS, 15)
      expect(new Set(set.map((q) => q.id)).size).toBe(set.length)
    }
  })

  it('handles a request larger than the bank', () => {
    const tiny = SEED_QUESTIONS.slice(0, 5)
    const set = diagnostic(tiny, 15)
    expect(set.length).toBe(5)
  })
})

describe('missed', () => {
  it('returns exactly the active missed questions', () => {
    const ids = [SEED_QUESTIONS[0].id, SEED_QUESTIONS[5].id]
    const set = missed(SEED_QUESTIONS, ids)
    expect(set).toHaveLength(2)
    expect(new Set(set.map((q) => q.id))).toEqual(new Set(ids))
  })

  it('ignores ids that are not in the bank', () => {
    const set = missed(SEED_QUESTIONS, ['nope-1'])
    expect(set).toHaveLength(0)
  })
})
