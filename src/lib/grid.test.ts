import { describe, it, expect } from 'vitest'
import { parseGrid, gridMatch } from './grid'

// The grid-in matcher is the highest-stakes pure function in the app: a bug here
// silently marks right answers wrong (or wrong answers right).

describe('parseGrid', () => {
  it('parses integers', () => {
    expect(parseGrid('42')).toBe(42)
    expect(parseGrid('0')).toBe(0)
  })

  it('parses negatives, including the unicode minus sign', () => {
    expect(parseGrid('-3')).toBe(-3)
    expect(parseGrid('−3')).toBe(-3) // U+2212, what iOS keyboards can produce
  })

  it('parses decimals with and without a leading zero', () => {
    expect(parseGrid('0.75')).toBe(0.75)
    expect(parseGrid('.75')).toBe(0.75)
  })

  it('parses fractions', () => {
    expect(parseGrid('3/4')).toBe(0.75)
    expect(parseGrid('-3/4')).toBe(-0.75)
    expect(parseGrid('1.5/3')).toBe(0.5)
  })

  it('tolerates surrounding and internal whitespace', () => {
    expect(parseGrid(' 3 / 4 ')).toBe(0.75)
    expect(parseGrid('  -3  ')).toBe(-3)
  })

  it('strips thousands commas and dollar signs', () => {
    expect(parseGrid('90,000')).toBe(90000)
    expect(parseGrid('$66')).toBe(66)
    expect(parseGrid('$1,200')).toBe(1200)
  })

  it('rejects division by zero', () => {
    expect(parseGrid('5/0')).toBeNull()
  })

  it('rejects non-numeric input', () => {
    expect(parseGrid('')).toBeNull()
    expect(parseGrid('   ')).toBeNull()
    expect(parseGrid('x = 5')).toBeNull()
    expect(parseGrid('5 meters')).toBeNull()
    expect(parseGrid('three')).toBeNull()
    expect(parseGrid('1/2/3')).toBeNull()
  })
})

describe('gridMatch', () => {
  it('accepts equivalent forms of the same number', () => {
    expect(gridMatch('0.75', '3/4')).toBe(true)
    expect(gridMatch('.75', '3/4')).toBe(true)
    expect(gridMatch('3/4', '0.75')).toBe(true)
    expect(gridMatch('6/8', '3/4')).toBe(true)
  })

  it('matches negatives across notations', () => {
    expect(gridMatch('−3', '-3')).toBe(true)
    expect(gridMatch('-6/2', '-3')).toBe(true)
  })

  it('rejects wrong values', () => {
    expect(gridMatch('0.74', '3/4')).toBe(false)
    expect(gridMatch('3', '-3')).toBe(false)
  })

  it('rejects unparseable input instead of crashing', () => {
    expect(gridMatch('abc', '3/4')).toBe(false)
    expect(gridMatch('', '3/4')).toBe(false)
  })

  it('tolerates tiny float error but rejects truncated decimals', () => {
    expect(gridMatch('0.333', '1/3')).toBe(false) // truncated — off by ~3e-4
    expect(gridMatch('0.3333333', '1/3')).toBe(true) // within the 1e-6 tolerance
  })
})
