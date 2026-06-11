import type { Section } from '../types'

// The 8 official Digital SAT skill areas. We tag every question with one of these
// and the dashboard reports accuracy per skill, so the weakest area is obvious.
export interface SkillInfo {
  section: Section
  skill: string
  blurb: string
}

export const SKILLS: SkillInfo[] = [
  { section: 'rw', skill: 'Information and Ideas', blurb: 'Central ideas, inference, command of evidence' },
  { section: 'rw', skill: 'Craft and Structure', blurb: 'Words in context, text structure, purpose' },
  { section: 'rw', skill: 'Expression of Ideas', blurb: 'Transitions, rhetorical synthesis' },
  { section: 'rw', skill: 'Standard English Conventions', blurb: 'Punctuation, boundaries, agreement, modifiers' },
  { section: 'math', skill: 'Algebra', blurb: 'Linear equations, slopes, systems, inequalities' },
  { section: 'math', skill: 'Advanced Math', blurb: 'Quadratics, exponentials, functions' },
  { section: 'math', skill: 'Problem-Solving and Data Analysis', blurb: 'Ratios, units, percentages, statistics' },
  { section: 'math', skill: 'Geometry and Trigonometry', blurb: 'Area, angles, circles, right triangles' },
]

export const ALL_SKILLS: string[] = SKILLS.map((s) => s.skill)
export const RW_SKILLS: string[] = SKILLS.filter((s) => s.section === 'rw').map((s) => s.skill)
export const MATH_SKILLS: string[] = SKILLS.filter((s) => s.section === 'math').map((s) => s.skill)

/** Which section a skill belongs to. Used when recording an attempt. */
export function sectionOf(skill: string): Section {
  return MATH_SKILLS.includes(skill) ? 'math' : 'rw'
}

export function blurbOf(skill: string): string {
  return SKILLS.find((s) => s.skill === skill)?.blurb ?? ''
}
