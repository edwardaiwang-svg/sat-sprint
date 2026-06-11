import { useState } from 'react'
import type { Question, Difficulty } from '../types'
import { useApp } from '../state/AppState'
import { APP_VERSION } from '../version'
import { ALL_SKILLS } from '../lib/taxonomy'
import { generateQuestions, gradeFreeResponse } from '../lib/claude'
import { SunIcon, MoonIcon, SparkleIcon } from '../components/Icons'

interface Props {
  startSession: (questions: Question[], title: string) => void
}

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 — balanced (recommended)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — faster & cheaper' },
]

export function Settings({ startSession }: Props) {
  const { theme, setTheme, settings, updateSettings, resetProgress, attempts, questions } = useApp()

  // Local draft of the AI credentials so typing doesn't thrash storage; saved on click.
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model)
  const [savedFlash, setSavedFlash] = useState(false)

  const aiCount = questions.filter((q) => q.id.startsWith('ai-')).length

  function saveAi() {
    updateSettings({ ...settings, apiKey: apiKey.trim(), model })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  function toggleAi(enabled: boolean) {
    updateSettings({ ...settings, aiEnabled: enabled, apiKey: apiKey.trim(), model })
  }

  const aiReady = settings.aiEnabled && settings.apiKey.trim().length > 0

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance ------------------------------------------------------- */}
      <section className="card mt-5 p-5">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <SunIcon className="h-4 w-4" /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                theme === 'dark' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <MoonIcon className="h-4 w-4" /> Dark
            </button>
          </div>
        </div>
      </section>

      {/* AI mode ---------------------------------------------------------- */}
      <section className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">AI mode (optional)</h2>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={settings.aiEnabled}
              onChange={(e) => toggleAi(e.target.checked)}
              aria-label="Enable AI mode"
            />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 dark:bg-slate-700 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:after:translate-x-5" />
          </label>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The whole app works without this. Turn it on to generate unlimited fresh questions and get AI re-explanations.
        </p>

        {/* Security warning */}
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          <strong>Personal / local use only.</strong> Your key is stored in this browser’s localStorage and sent directly
          to Anthropic from your device. Never deploy a public website with your key in the browser — anyone could read
          and use it.
        </div>

        {settings.aiEnabled && (
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Anthropic API key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Model</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={saveAi} className="btn btn-ghost w-full">
              {savedFlash ? 'Saved ✓' : 'Save key & model'}
            </button>
          </div>
        )}
      </section>

      {/* AI lab (only when ready) ---------------------------------------- */}
      {aiReady && <AiLab startSession={startSession} />}

      {/* Data ------------------------------------------------------------- */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold">Your data</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {attempts.length} answers recorded · {aiCount} AI-generated question{aiCount === 1 ? '' : 's'} in your bank.
        </p>
        <ResetButton onReset={resetProgress} />
      </section>

      <p className="mt-6 px-1 text-center text-xs text-slate-500 dark:text-slate-400">
        SAT Sprint v{APP_VERSION} · no backend — progress is stored only in this browser. Optional AI mode calls
        Anthropic directly.
      </p>
    </div>
  )
}

// ---- AI lab: generate questions + grade a free response --------------------

function AiLab({ startSession }: Props) {
  const { settings, addCustomQuestions } = useApp()
  const cfg = { apiKey: settings.apiKey, model: settings.model }

  const [skill, setSkill] = useState(ALL_SKILLS[3]) // default: Standard English Conventions
  const [difficulty, setDifficulty] = useState<Difficulty>('hard')
  const [count, setCount] = useState(3)
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [generated, setGenerated] = useState<Question[] | null>(null)

  async function handleGenerate() {
    setGenLoading(true)
    setGenError('')
    setGenerated(null)
    try {
      const qs = await generateQuestions(cfg, skill, difficulty, count)
      addCustomQuestions(qs)
      setGenerated(qs)
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Generation failed.')
    } finally {
      setGenLoading(false)
    }
  }

  const [promptText, setPromptText] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [gradeLoading, setGradeLoading] = useState(false)
  const [gradeError, setGradeError] = useState('')
  const [feedback, setFeedback] = useState('')

  async function handleGrade() {
    setGradeLoading(true)
    setGradeError('')
    setFeedback('')
    try {
      const text = await gradeFreeResponse(cfg, promptText, answerText)
      setFeedback(text)
    } catch (e) {
      setGradeError(e instanceof Error ? e.message : 'Grading failed.')
    } finally {
      setGradeLoading(false)
    }
  }

  return (
    <section className="card mt-4 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <SparkleIcon className="h-4 w-4 text-indigo-500" /> AI lab
      </h2>

      {/* Generate questions */}
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Generate fresh questions
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          aria-label="Skill"
          className="col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        >
          {ALL_SKILLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          aria-label="Difficulty"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          aria-label="Number of questions"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        >
          {[1, 3, 5].map((n) => (
            <option key={n} value={n}>
              {n} question{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleGenerate} disabled={genLoading} className="btn btn-primary mt-2 w-full">
        <SparkleIcon className="h-4 w-4" />
        {genLoading ? 'Generating…' : 'Generate & add to bank'}
      </button>
      {genError && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{genError}</p>}
      {generated && (
        <div className="mt-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <p className="text-emerald-800 dark:text-emerald-300">Added {generated.length} question(s) to your bank.</p>
          <button onClick={() => startSession(generated, `AI: ${skill}`)} className="btn btn-ghost mt-2 w-full">
            Practice them now
          </button>
        </div>
      )}

      {/* Grade a free response */}
      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Grade a short free response
      </p>
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        rows={2}
        aria-label="The prompt or question you answered"
        placeholder="The prompt / question you answered"
        className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        rows={3}
        aria-label="Your answer"
        placeholder="Your answer"
        className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        onClick={handleGrade}
        disabled={gradeLoading || !answerText.trim()}
        className="btn btn-ghost mt-2 w-full"
      >
        {gradeLoading ? 'Grading…' : 'Get feedback'}
      </button>
      {gradeError && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{gradeError}</p>}
      {feedback && (
        <div className="mt-2 whitespace-pre-line rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm leading-relaxed dark:border-indigo-900/50 dark:bg-indigo-950/30">
          {feedback}
        </div>
      )}
    </section>
  )
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false)
  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn btn-ghost mt-3 w-full text-rose-600 dark:text-rose-400">
        Reset all progress
      </button>
    )
  }
  return (
    <div className="mt-3 flex gap-2">
      <button onClick={() => setConfirming(false)} className="btn btn-ghost flex-1">
        Cancel
      </button>
      <button
        onClick={() => {
          onReset()
          setConfirming(false)
        }}
        className="btn flex-1 bg-rose-600 text-white hover:bg-rose-500"
      >
        Yes, reset
      </button>
    </div>
  )
}
