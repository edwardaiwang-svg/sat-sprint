import { useState } from 'react'
import type { Question } from '../types'
import { useApp } from '../state/AppState'
import { reExplain } from '../lib/claude'
import { CheckIcon, XIcon, SparkleIcon } from './Icons'

// Shown after an answer is locked in. Teaches the rule (the `explanation`),
// names the `trap`, and — if AI mode is on — can re-teach with a fresh example.
export function Explanation({ question, wasCorrect }: { question: Question; wasCorrect: boolean }) {
  const { settings } = useApp()
  const [aiText, setAiText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReexplain() {
    setLoading(true)
    setError('')
    setAiText('')
    try {
      const text = await reExplain({ apiKey: settings.apiKey, model: settings.model }, question)
      setAiText(text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Correct / incorrect banner */}
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
          wasCorrect
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
        }`}
      >
        {wasCorrect ? <CheckIcon className="h-5 w-5" /> : <XIcon className="h-5 w-5" />}
        {wasCorrect ? 'Correct' : 'Not quite'}
      </div>

      {/* The rule + quick test */}
      <div className="card p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Why</p>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{question.explanation}</p>
      </div>

      {/* The trap the wrong answers set */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          The trap
        </p>
        <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{question.trap}</p>
      </div>

      {/* Optional AI tutor — only appears when AI mode is enabled in Settings */}
      {settings.aiEnabled && settings.apiKey && (
        <div>
          <button onClick={handleReexplain} disabled={loading} className="btn btn-ghost w-full">
            <SparkleIcon className="h-4 w-4" />
            {loading ? 'Asking Claude…' : 'Explain differently (AI)'}
          </button>
          {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          {aiText && (
            <div className="mt-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-slate-200">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">AI tutor</p>
              <p className="whitespace-pre-line">{aiText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
