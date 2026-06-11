import { SkillBars } from './SkillBars'
import type { BarRow } from './SkillBars'
import { pct } from '../lib/stats'
import { SparkleIcon } from './Icons'

interface Result {
  skill: string
  correct: boolean
}

// Shown at the end of a set: overall score plus a by-skill breakdown so the
// student can immediately see which area was weakest in this session. If
// onDrill is provided, it recommends a focused drill on that weakest skill.
export function SetSummary({
  title,
  results,
  onExit,
  onDrill,
}: {
  title: string
  results: Result[]
  onExit: () => void
  onDrill?: (skill: string) => void
}) {
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const accuracy = total ? correct / total : NaN

  // Group this set's results by skill.
  const bySkill = new Map<string, { correct: number; total: number }>()
  for (const r of results) {
    const cur = bySkill.get(r.skill) ?? { correct: 0, total: 0 }
    cur.total += 1
    if (r.correct) cur.correct += 1
    bySkill.set(r.skill, cur)
  }

  const rows: BarRow[] = [...bySkill.entries()].map(([skill, s]) => ({
    label: skill,
    correct: s.correct,
    total: s.total,
    accuracy: s.total ? s.correct / s.total : NaN,
  }))

  // The weakest skill in THIS set — ties break toward more attempts, matching weakestSkill().
  const weakest = [...rows].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0]
  const encouragement =
    accuracy >= 0.9
      ? 'Excellent set.'
      : accuracy >= 0.7
        ? 'Solid work.'
        : accuracy >= 0.4
          ? 'Good practice — misses are saved for redo.'
          : 'Tough set — every miss is saved for redo.'

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title} complete</p>
        <h1 className="mt-1 text-3xl font-bold">{encouragement}</h1>

        {/* Big score */}
        <div className="card mt-6 flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
            <p className="text-4xl font-bold tabular-nums">
              {correct}
              <span className="text-2xl text-slate-400">/{total}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Accuracy</p>
            <p className="text-4xl font-bold tabular-nums text-indigo-500">{pct(accuracy)}</p>
          </div>
        </div>

        {/* By-skill breakdown */}
        {rows.length > 0 && (
          <div className="card mt-4 p-5">
            <h2 className="mb-4 text-sm font-semibold">By skill</h2>
            <SkillBars rows={rows} highlight={rows.length > 1 ? weakest?.label : undefined} />
            {rows.length > 1 && weakest && Number.isFinite(weakest.accuracy) && weakest.accuracy < 1 && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Weakest this set: <span className="font-semibold text-slate-700 dark:text-slate-200">{weakest.label}</span>.
                Any misses are now in your Misses tab.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recommend the next drill on the weakest skill of this set. */}
      <div className="mt-6 space-y-2">
        {onDrill && weakest && Number.isFinite(weakest.accuracy) && weakest.accuracy < 1 && (
          <button onClick={() => onDrill(weakest.label)} className="btn btn-primary w-full">
            <SparkleIcon className="h-4 w-4" />
            Drill your weakest: {weakest.label}
          </button>
        )}
        <button
          onClick={onExit}
          className={`btn w-full ${
            onDrill && weakest && Number.isFinite(weakest.accuracy) && weakest.accuracy < 1 ? 'btn-ghost' : 'btn-primary'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  )
}
