// The single source of truth for what a practice question looks like.
// Every seed question and every AI-generated question matches this shape.

export type Section = 'rw' | 'math'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'mcq' | 'grid'

export interface Question {
  id: string
  section: Section
  /** A short, finer-grained sub-skill label shown as a chip (e.g. "Sentence boundaries"). */
  domain: string
  /** One of the 8 official Digital SAT skill areas — this drives the dashboard. */
  skill: string
  difficulty: Difficulty
  type: QuestionType
  prompt: string
  /** Exactly 4 strings for an mcq; omitted for a grid (student-produced response). */
  choices?: string[]
  /** mcq: the EXACT text of the correct choice. grid: the numeric answer as a string. */
  answer: string
  /** Teaches the underlying RULE and a quick test/habit — not just "the answer is B." */
  explanation: string
  /** Names the mistake the wrong answers are designed to cause. */
  trap: string
}
