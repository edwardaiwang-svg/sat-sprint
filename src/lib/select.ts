import type { Question } from '../types'

// Helpers that build a set of questions for each practice mode.

/** Fisher–Yates shuffle (returns a new array; doesn't mutate the input). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** A focused set on one skill (used by "Practice by skill" and "Targeted drill"). */
export function bySkill(bank: Question[], skill: string, n = 8): Question[] {
  return shuffle(bank.filter((q) => q.skill === skill)).slice(0, n)
}

/** A random mixed set across every skill. */
export function mixed(bank: Question[], n = 10): Question[] {
  return shuffle(bank).slice(0, n)
}

/**
 * A diagnostic spread: at least one question from each skill that exists in the
 * bank, then filled out at random up to n. Good for finding weak spots fast.
 */
export function diagnostic(bank: Question[], n = 15): Question[] {
  const bySkillMap = new Map<string, Question[]>()
  for (const q of bank) {
    if (!bySkillMap.has(q.skill)) bySkillMap.set(q.skill, [])
    bySkillMap.get(q.skill)!.push(q)
  }

  const picked: Question[] = []
  const used = new Set<string>()
  for (const qs of bySkillMap.values()) {
    const first = shuffle(qs)[0]
    if (first) {
      picked.push(first)
      used.add(first.id)
    }
  }

  const rest = shuffle(bank.filter((q) => !used.has(q.id)))
  while (picked.length < n && rest.length) picked.push(rest.shift()!)

  return shuffle(picked).slice(0, n)
}

/** Just the questions currently in your error log (your active misses). */
export function missed(bank: Question[], activeIds: string[]): Question[] {
  const set = new Set(activeIds)
  return shuffle(bank.filter((q) => set.has(q.id)))
}
