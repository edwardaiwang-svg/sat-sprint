import type { ReactNode } from 'react'
import type { Question } from '../types'
import { useApp } from '../state/AppState'
import { diagnostic, mixed, missed, bySkill } from '../lib/select'
import { weakestSkill, statsBySkill, overallAccuracy, pct } from '../lib/stats'
import { SKILLS } from '../lib/taxonomy'
import { ChevronRightIcon, SparkleIcon, FlagIcon, ChartIcon } from '../components/Icons'

interface Props {
  startSession: (questions: Question[], title: string) => void
}

// The hub. A quick snapshot of progress, the main actions, and a per-skill list.
export function Home({ startSession }: Props) {
  const { questions, attempts, missedQuestionIds } = useApp()

  const weakest = weakestSkill(attempts)
  const acc = overallAccuracy(attempts)
  const stats = statsBySkill(attempts)
  const statFor = (skill: string) => stats.find((s) => s.skill === skill)!

  const missCount = missedQuestionIds.length
  // The drill set is capped by how many questions the bank has for that skill,
  // so show the real number instead of promising a fixed 8.
  const drillSize = Math.min(8, questions.filter((q) => q.skill === weakest).length)

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Let’s sharpen your Digital SAT score.</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Short sets, instant feedback. Your weakest area is highlighted below.
      </p>

      {/* Snapshot row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Answered" value={String(attempts.length)} />
        <Stat label="Accuracy" value={pct(acc)} />
        <Stat label="Misses to clear" value={String(missCount)} accent={missCount > 0} />
      </div>

      {/* Primary actions */}
      <div className="mt-6 space-y-3">
        <BigAction
          title="Take a diagnostic"
          subtitle="15 mixed questions · finds your weak spots"
          icon={<ChartIcon className="h-5 w-5" />}
          onClick={() => startSession(diagnostic(questions, 15), 'Diagnostic')}
        />
        <BigAction
          title="Redo my misses"
          subtitle={missCount > 0 ? `${missCount} waiting · clear each with 2 in a row` : 'Nothing to redo yet — nice'}
          icon={<FlagIcon className="h-5 w-5" />}
          disabled={missCount === 0}
          onClick={() => startSession(missed(questions, missedQuestionIds), 'Redo my misses')}
        />
        <BigAction
          title={`Targeted drill: ${weakest}`}
          subtitle={`${drillSize} questions on your current weakest skill`}
          icon={<SparkleIcon className="h-5 w-5" />}
          accent
          onClick={() => startSession(bySkill(questions, weakest, 8), `Drill: ${weakest}`)}
        />
        <BigAction
          title="Mixed practice"
          subtitle="10 questions across every skill"
          icon={<ChevronRightIcon className="h-5 w-5" />}
          onClick={() => startSession(mixed(questions, 10), 'Mixed practice')}
        />
      </div>

      {/* Practice by skill */}
      <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-500 dark:text-slate-400">Practice by skill</h2>
      <div className="space-y-2">
        {SKILLS.map((s) => {
          const st = statFor(s.skill)
          const count = questions.filter((q) => q.skill === s.skill).length
          return (
            <button
              key={s.skill}
              onClick={() => startSession(bySkill(questions, s.skill, 8), `Drill: ${s.skill}`)}
              disabled={count === 0}
              className="card flex w-full items-center gap-3 p-3.5 text-left transition hover:border-indigo-400 disabled:opacity-50 dark:hover:border-indigo-500"
            >
              <span
                className={`chip shrink-0 ${
                  s.section === 'math'
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                    : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                }`}
              >
                {s.section === 'math' ? 'Math' : 'R&W'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{s.skill}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{s.blurb}</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {st.total === 0 ? `${count} Q` : pct(st.accuracy)}
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          )
        })}
      </div>
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

function BigAction({
  title,
  subtitle,
  icon,
  onClick,
  disabled,
  accent,
}: {
  title: string
  subtitle: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 ${
        accent
          ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-500'
          : 'card hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accent ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className={`block truncate text-sm ${accent ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
          {subtitle}
        </span>
      </span>
    </button>
  )
}
