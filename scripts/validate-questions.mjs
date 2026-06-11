// Quality gate: structurally validates the question bank before a release.
// Run with `npm run validate`. Exits non-zero if any check fails, so it can
// gate a CI pipeline or a pre-release checklist.
//
// Checks per question:
//   - unique id, known skill, section matches the skill's section
//   - valid difficulty and type
//   - non-empty prompt / explanation / trap
//   - mcq: exactly 4 unique choices, and `answer` is exactly one of them
//   - grid: no choices, and `answer` parses as a number or fraction
// Plus: every one of the 8 skills has at least one question.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

// The data file is TypeScript, but its only TS syntax is one type import and
// one annotation — strip those and Node can import it directly. This keeps the
// gate dependency-free (no ts-node/tsx needed).
const srcUrl = new URL('../src/data/questions.ts', import.meta.url)
let code = readFileSync(srcUrl, 'utf8')
code = code.replace(/^import type.*$/m, '')
code = code.replace(/export const SEED_QUESTIONS:\s*Question\[\]\s*=/, 'export const SEED_QUESTIONS =')

const dir = mkdtempSync(join(tmpdir(), 'satq-'))
const tmp = join(dir, 'questions.mjs')
writeFileSync(tmp, code)
const { SEED_QUESTIONS } = await import(pathToFileURL(tmp).href)
rmSync(dir, { recursive: true, force: true })

const RW_SKILLS = [
  'Information and Ideas',
  'Craft and Structure',
  'Expression of Ideas',
  'Standard English Conventions',
]
const MATH_SKILLS = [
  'Algebra',
  'Advanced Math',
  'Problem-Solving and Data Analysis',
  'Geometry and Trigonometry',
]
const ALL_SKILLS = [...RW_SKILLS, ...MATH_SKILLS]

// Mirrors src/lib/grid.ts parseGrid: accepts integers, decimals, fractions, unicode minus.
function parseGrid(value) {
  const v = String(value).trim().replace(/−/g, '-').replace(/\s+/g, '')
  if (!v) return null
  const frac = v.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/)
  if (frac) {
    const den = parseFloat(frac[2])
    return den === 0 ? null : parseFloat(frac[1]) / den
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const errors = []
const ids = new Set()

for (const q of SEED_QUESTIONS) {
  const at = `[${q.id}]`
  if (ids.has(q.id)) errors.push(`${at} duplicate id`)
  ids.add(q.id)

  if (!ALL_SKILLS.includes(q.skill)) errors.push(`${at} unknown skill "${q.skill}"`)
  const expectedSection = MATH_SKILLS.includes(q.skill) ? 'math' : 'rw'
  if (q.section !== expectedSection) errors.push(`${at} section "${q.section}" should be "${expectedSection}"`)
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errors.push(`${at} bad difficulty "${q.difficulty}"`)
  if (!['mcq', 'grid'].includes(q.type)) errors.push(`${at} bad type "${q.type}"`)
  if (!q.prompt?.trim()) errors.push(`${at} empty prompt`)
  if (!q.explanation?.trim()) errors.push(`${at} empty explanation`)
  if (!q.trap?.trim()) errors.push(`${at} empty trap`)

  if (q.type === 'mcq') {
    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      errors.push(`${at} mcq must have exactly 4 choices`)
    } else {
      if (new Set(q.choices).size !== q.choices.length) errors.push(`${at} duplicate choices`)
      if (!q.choices.includes(q.answer)) errors.push(`${at} answer is not one of the choices`)
    }
  } else {
    if (q.choices) errors.push(`${at} grid question should not have choices`)
    if (parseGrid(q.answer) === null) errors.push(`${at} grid answer "${q.answer}" is not numeric`)
  }
}

// Coverage report + check.
const bySkill = {}
for (const q of SEED_QUESTIONS) bySkill[q.skill] = (bySkill[q.skill] ?? 0) + 1
console.log(`Question bank: ${SEED_QUESTIONS.length} questions`)
for (const s of ALL_SKILLS) {
  console.log(`  ${String(bySkill[s] ?? 0).padStart(2)}  ${s}`)
  if (!bySkill[s]) errors.push(`no questions for skill "${s}"`)
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log('\n✓ All checks passed.')
