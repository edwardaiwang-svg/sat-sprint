import type { Question } from '../types'
import { useApp } from '../state/AppState'
import { statsBySkill, weakestSkill, overallAccuracy, pct } from '../lib/stats'
import { blurbOf } from '../lib/taxonomy'
import { bySkill } from '../lib/select'
import { SkillBars } from '../components/SkillBars'
import type { BarRow } from '../components/SkillBars'
import { SparkleIcon } from '../components/Icons'

interface Props {
  startSession: (questions: Question[], title: string) => void
}

// The persistent progress dashboard: accuracy per skill, totals, misses to
// clear, with the weakest skill made obvious and a one-tap drill on it.
export function Dashboard({ startSession }: Props) {
  const { questions, attempts, missedQuestionIds } = useApp()
  const stats = statsBySkill(attempts)
  const weakest = weakestSkill(attempts)
  const acc = overallAccuracy(attempts)
  const hasData = attempts.length > 0
  // Don't call a skill "weakest" while it's sitting at 100% — that only happens
  // when everything attempted so far is perfect, and the label reads as a bug.
  const weakestStat = stats.find((s) => s.skill === weakest)
  const showWeakest = hasData && weakestStat !== undefined && weakestStat.accuracy < 1

  const toRow = (skill: string): BarRow => {
    const s = stats.find((x) => x.skill === skill)!
    return { label: s.skill, correct: s.correct, total: s.total, accuracy: s.accuracy, sublabel: blurbOf(skill) }
  }

  const rwRows = stats.filter((s) => s.section === 'rw').map((s) => toRow(s.skill))
  const mathRows = stats.filter((s) => s.section === 'math').map((s) => toRow(s.skill))

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Progress</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Saved on this device and kept across refreshes.
      </p>

      {/* Headline numbers */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Answered" value={String(attempts.length)} />
        <Stat label="Accuracy" value={pct(acc)} />
        <Stat label="Misses to clear" value={String(missedQuestionIds.length)} accent={missedQuestionIds.length > 0} />
      </div>

      {/* Weakest skill callout */}
      {showWeakest && (
        <div className="card mt-4 flex items-center gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Weakest skill</p>
            <p className="mt-0.5 truncate font-semibold">{weakest}</p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{blurbOf(weakest)}</p>
          </div>
          <button
            onClick={() => startSession(bySkill(questions, weakest, 8), `Drill: ${weakest}`)}
            className="btn btn-primary shrink-0"
          >
            <SparkleIcon className="h-4 w-4" />
            Drill it
          </button>
        </div>
      )}

      {!hasData && (
        <div className="card mt-4 p-5 text-center text-sm text-slate-500 dark:text-slate-400">
          No data yet. Take a diagnostic or practice a skill, and your accuracy will appear here.
        </div>
      )}

      {/* Per-skill bars */}
      <section className="card mt-4 p-5">
        <h2 className="mb-4 text-sm font-semibold">Reading &amp; Writing</h2>
        <SkillBars rows={rwRows} highlight={showWeakest ? weakest : undefined} />
      </section>

      <section className="card mt-4 p-5">
        <h2 className="mb-4 text-sm font-semibold">Math</h2>
        <SkillBars rows={mathRows} highlight={showWeakest ? weakest : undefined} />
      </section>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card p-3 text-center">
      <p className={`text-2xl font-bold tabular-nums ${accent ? 'text-rose-500' : ''}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
