import { pct } from '../lib/stats'

// A reusable list of labeled accuracy bars. Used on the dashboard and the
// set summary. Color encodes performance so the weakest area pops out.

export interface BarRow {
  label: string
  correct: number
  total: number
  accuracy: number // 0..1 or NaN when nothing attempted
  sublabel?: string
}

function barColor(accuracy: number): string {
  if (Number.isNaN(accuracy)) return 'bg-slate-300 dark:bg-slate-700'
  if (accuracy >= 0.8) return 'bg-emerald-500'
  if (accuracy >= 0.6) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function SkillBars({ rows, highlight }: { rows: BarRow[]; highlight?: string }) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const widthPct = Number.isNaN(r.accuracy) ? 0 : Math.round(r.accuracy * 100)
        const isHighlighted = highlight === r.label
        return (
          <li
            key={r.label}
            className={isHighlighted ? '-m-2 rounded-xl p-2 ring-2 ring-indigo-500/60' : ''}
          >
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium">
                {r.label}
                {isHighlighted && (
                  <span className="ml-2 align-middle text-xs font-semibold text-indigo-500">focus</span>
                )}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {r.total === 0 ? 'not yet' : `${r.correct}/${r.total} · ${pct(r.accuracy)}`}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${barColor(r.accuracy)} transition-all duration-500 ease-out`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            {r.sublabel && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{r.sublabel}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
