import type { Attempt } from './storage'
import { ALL_SKILLS, sectionOf } from './taxonomy'
import type { Section } from '../types'

export interface SkillStat {
  skill: string
  section: Section
  total: number
  correct: number
  /** Accuracy as 0..1, or NaN when nothing has been attempted yet. */
  accuracy: number
}

/** Accuracy for each of the 8 skills, computed from the full attempt history. */
export function statsBySkill(attempts: Attempt[]): SkillStat[] {
  return ALL_SKILLS.map((skill) => {
    const rows = attempts.filter((a) => a.skill === skill)
    const correct = rows.filter((a) => a.correct).length
    return {
      skill,
      section: sectionOf(skill),
      total: rows.length,
      correct,
      accuracy: rows.length ? correct / rows.length : NaN,
    }
  })
}

// Your weakest skill = the lowest accuracy among skills you've actually attempted.
// Ties break toward the skill with MORE attempts (more confident it's a real weakness).
// Before you've answered anything, we default to your known #1 priority.
export function weakestSkill(attempts: Attempt[], fallback = 'Standard English Conventions'): string {
  const attempted = statsBySkill(attempts).filter((s) => s.total > 0)
  if (attempted.length === 0) return fallback
  attempted.sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
  return attempted[0].skill
}

export function overallAccuracy(attempts: Attempt[]): number {
  if (attempts.length === 0) return NaN
  return attempts.filter((a) => a.correct).length / attempts.length
}

/** Formats a 0..1 accuracy (or NaN) as a friendly percentage string. */
export function pct(accuracy: number): string {
  return Number.isNaN(accuracy) ? '—' : `${Math.round(accuracy * 100)}%`
}
