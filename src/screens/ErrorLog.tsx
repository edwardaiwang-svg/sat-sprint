import type { Question } from '../types'
import { useApp } from '../state/AppState'
import { missed } from '../lib/select'
import { FlagIcon } from '../components/Icons'

interface Props {
  startSession: (questions: Question[], title: string) => void
}

// The error log: every question you've missed, served until you get each one
// right twice in a row. This is the "redo my misses" feature.
export function ErrorLog({ startSession }: Props) {
  const { questions, errorLog, missedQuestionIds } = useApp()

  const items = missedQuestionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q))

  if (items.length === 0) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-bold">Misses</h1>
        <div className="card mt-6 flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
            <FlagIcon className="h-6 w-6" />
          </span>
          <p className="font-semibold">Nothing to redo</p>
          <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Miss a question anywhere in the app and it lands here automatically. Clear it by answering correctly twice in a row.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Misses</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {items.length} {items.length === 1 ? 'question' : 'questions'} to clear · 2 correct in a row each
          </p>
        </div>
      </div>

      <button
        onClick={() => startSession(missed(questions, missedQuestionIds), 'Redo my misses')}
        className="btn btn-primary mt-4 w-full"
      >
        <FlagIcon className="h-4 w-4" />
        Redo all {items.length} now
      </button>

      <ul className="mt-5 space-y-2.5">
        {items.map((q) => {
          const entry = errorLog[q.id]
          const streak = entry?.consecutiveCorrect ?? 0
          // Preview line: usually the first line of the prompt — but for
          // notes-style prompts ("...has taken the following notes:") that line
          // is identical across questions, so show the goal line at the end instead.
          const lines = q.prompt.split('\n').map((l) => l.trim()).filter(Boolean)
          const preview = lines[0].endsWith(':') ? lines[lines.length - 1] : lines[0]
          return (
            <li key={q.id} className="card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="chip bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {q.skill}
                </span>
                <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{q.domain}</span>
              </div>
              <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-200">{preview}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Progress to clear:</span>
                <Dot filled={streak >= 1} />
                <Dot filled={streak >= 2} />
                <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{Math.min(streak, 2)}/2</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Dot({ filled }: { filled: boolean }) {
  return (
    <span
      className={`h-3 w-3 rounded-full ${filled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
      aria-hidden
    />
  )
}
