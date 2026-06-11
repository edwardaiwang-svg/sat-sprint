import { describe, it, expect } from 'vitest'
import { extractJsonArray, normalizeQuestion } from './claude'

// The validation layer between the model's output and the question bank.
// Anything that slips through here ends up persisted in localStorage.

describe('extractJsonArray', () => {
  it('parses a bare JSON array', () => {
    expect(extractJsonArray('[1, 2]')).toEqual([1, 2])
  })

  it('strips markdown fences and surrounding prose', () => {
    expect(extractJsonArray('Here you go:\n```json\n[{"a":1}]\n```\nEnjoy!')).toEqual([{ a: 1 }])
  })

  it('throws a friendly error on truncated JSON', () => {
    expect(() => extractJsonArray('[{"a": 1}, {"b": ')).toThrow(/malformed|did not return/i)
  })

  it('throws when there is no array at all', () => {
    expect(() => extractJsonArray('Sorry, I cannot do that.')).toThrow()
  })
})

const validMcq = {
  domain: 'Slopes',
  type: 'mcq',
  prompt: 'What is 2 + 2?',
  choices: ['3', '4', '5', '6'],
  answer: '4',
  explanation: 'Add the numbers.',
  trap: 'Off-by-one.',
}

describe('normalizeQuestion', () => {
  it('accepts a valid mcq and tags it with the requested skill', () => {
    const q = normalizeQuestion(validMcq, 'Algebra', 0)
    expect(q).not.toBeNull()
    expect(q!.skill).toBe('Algebra')
    expect(q!.section).toBe('math')
    expect(q!.id.startsWith('ai-')).toBe(true)
  })

  it('rejects an mcq whose answer matches no choice', () => {
    expect(normalizeQuestion({ ...validMcq, answer: '7' }, 'Algebra', 0)).toBeNull()
  })

  it('rejects an mcq without exactly 4 unique choices', () => {
    expect(normalizeQuestion({ ...validMcq, choices: ['4', '5'] }, 'Algebra', 0)).toBeNull()
    expect(normalizeQuestion({ ...validMcq, choices: ['3', '4', '4', '5'] }, 'Algebra', 0)).toBeNull()
    expect(normalizeQuestion({ ...validMcq, choices: ['1', '2', '3', '4', '5'] }, 'Algebra', 0)).toBeNull()
  })

  it('rejects a grid question whose answer cannot be parsed as a number', () => {
    const grid = { ...validMcq, type: 'grid', choices: undefined, answer: 'x = 5' }
    expect(normalizeQuestion(grid, 'Algebra', 0)).toBeNull()
  })

  it('accepts a grid question with a fraction answer', () => {
    const grid = { ...validMcq, type: 'grid', choices: undefined, answer: '3/4' }
    const q = normalizeQuestion(grid, 'Algebra', 0)
    expect(q).not.toBeNull()
    expect(q!.type).toBe('grid')
    expect(q!.choices).toBeUndefined()
  })

  it('rejects empty prompts and answers', () => {
    expect(normalizeQuestion({ ...validMcq, prompt: '  ' }, 'Algebra', 0)).toBeNull()
    expect(normalizeQuestion({ ...validMcq, answer: '' }, 'Algebra', 0)).toBeNull()
    expect(normalizeQuestion(null, 'Algebra', 0)).toBeNull()
  })
})
