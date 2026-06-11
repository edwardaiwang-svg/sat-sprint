import { useRef, useState, type FormEvent } from 'react'
import type { Question } from '../types'
import { useApp } from '../state/AppState'
import { gridMatch } from '../lib/grid'
import { ProgressBar } from './ProgressBar'
import { Explanation } from './Explanation'
import { SetSummary } from './SetSummary'
import { CloseIcon, CheckIcon, XIcon, ArrowRightIcon } from './Icons'

interface Props {
  questions: Question[]
  title: string
  onExit: () => void
  /** Optional: start a focused drill on a skill (used by the summary's recommendation). */
  onDrillSkill?: (skill: string) => void
}

interface Result {
  skill: string
  correct: boolean
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// The core practice loop: shows one question, locks the choices on answer,
// marks correct/incorrect, reveals the teaching explanation, then advances.
// Used by every mode (practice, diagnostic, drill, redo misses).
export function QuestionRunner({ questions, title, onExit, onDrillSkill }: Props) {
  const { recordAnswer } = useApp()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null) // chosen choice or typed grid value
  const [gridValue, setGridValue] = useState('')
  const [locked, setLocked] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  // Focus target when a new question appears, so keyboard/screen-reader users
  // aren't dropped on <body> after the sticky Next button unmounts.
  const promptRef = useRef<HTMLParagraphElement>(null)

  const total = questions.length

  // When we've gone past the last question, show the summary screen.
  if (index >= total) {
    return <SetSummary title={title} results={results} onExit={onExit} onDrill={onDrillSkill} />
  }

  const q = questions[index]
  const score = results.filter((r) => r.correct).length
  const wasCorrect =
    locked && selected !== null && (q.type === 'grid' ? gridMatch(selected, q.answer) : selected === q.answer)

  // Record the answer exactly once, when the user locks it in.
  function lockIn(value: string, correct: boolean) {
    setSelected(value)
    setLocked(true)
    setResults((prev) => [...prev, { skill: q.skill, correct }])
    recordAnswer(q, correct)
  }

  function chooseMcq(choice: string) {
    if (locked) return
    lockIn(choice, choice === q.answer)
  }

  function submitGrid(e: FormEvent) {
    e.preventDefault()
    if (locked || !gridValue.trim()) return
    lockIn(gridValue.trim(), gridMatch(gridValue, q.answer))
  }

  function next() {
    setIndex((i) => i + 1)
    setSelected(null)
    setGridValue('')
    setLocked(false)
    // On a phone the explanation pushes the page down — start the next
    // question at the top, and move focus onto it.
    window.scrollTo(0, 0)
    requestAnimationFrame(() => promptRef.current?.focus())
  }

  function mcqButtonClass(choice: string): string {
    const b =
      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition '
    if (!locked) {
      return (
        b +
        'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800'
      )
    }
    if (choice === q.answer) {
      return b + 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
    }
    if (choice === selected) {
      return b + 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
    }
    return b + 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4">
      {/* Header: exit, progress, running score */}
      <header className="sticky top-0 z-10 -mx-4 bg-slate-50/90 px-4 pb-3 pt-4 backdrop-blur dark:bg-slate-950/90">
        <div className="mb-2 flex items-center gap-3">
          <button onClick={onExit} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label="Exit set">
            <CloseIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
          </div>
          <p className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {index + 1} / {total} · {score} correct
          </p>
        </div>
        {/* Fill the bar as each answer locks so it reaches 100% on the last question. */}
        <ProgressBar value={locked ? index + 1 : index} max={total} />
      </header>

      <main className="flex-1 py-5">
        {/* Announces the result to screen readers (the visual banner is not a live region). */}
        <div role="status" aria-live="polite" className="sr-only">
          {locked ? (wasCorrect ? 'Correct.' : `Incorrect. The correct answer is ${q.answer}.`) : ''}
        </div>

        {/* Skill + difficulty chips */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="chip bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            {q.skill}
          </span>
          <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{q.domain}</span>
          <span className="chip capitalize bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{q.difficulty}</span>
        </div>

        {/* The prompt (passages keep their line breaks) */}
        <p
          ref={promptRef}
          tabIndex={-1}
          className="mb-5 whitespace-pre-line text-[15px] leading-relaxed text-slate-800 outline-none dark:text-slate-100"
        >
          {q.prompt}
        </p>

        {/* MCQ choices */}
        {q.type === 'mcq' && q.choices && (
          <div className="space-y-2.5">
            {q.choices.map((choice, i) => (
              <button key={choice} onClick={() => chooseMcq(choice)} disabled={locked} className={mcqButtonClass(choice)}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{choice}</span>
                {locked && choice === q.answer && <CheckIcon className="h-5 w-5 shrink-0 text-emerald-600" />}
                {locked && choice === selected && choice !== q.answer && (
                  <XIcon className="h-5 w-5 shrink-0 text-rose-600" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Grid-in (student-produced response) */}
        {q.type === 'grid' && (
          <form onSubmit={submitGrid} className="space-y-2.5">
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              value={gridValue}
              onChange={(e) => {
                // Mirror the real test's grid-in keypad: digits, minus, slash,
                // decimal point; 5 characters (6 with a leading minus).
                const v = e.target.value.replace(/[^0-9./-]/g, '')
                setGridValue(v.slice(0, v.startsWith('-') ? 6 : 5))
              }}
              disabled={locked}
              placeholder="Type your answer (e.g. -3, 3/4, 0.75)"
              className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
                locked
                  ? wasCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'border-slate-300 bg-white focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900'
              }`}
            />
            {!locked && (
              <button type="submit" disabled={!gridValue.trim()} className="btn btn-primary w-full">
                Check answer
              </button>
            )}
            {locked && !wasCorrect && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Correct answer: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{q.answer}</span>
              </p>
            )}
          </form>
        )}

        {/* Feedback + teaching */}
        {locked && (
          <div className="mt-6">
            <Explanation question={q} wasCorrect={wasCorrect} />
          </div>
        )}
      </main>

      {/* Sticky Next button once an answer is locked */}
      {locked && (
        <footer className="safe-bottom sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <button onClick={next} className="btn btn-primary w-full">
            {index + 1 >= total ? 'See results' : 'Next question'}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </footer>
      )}
    </div>
  )
}
