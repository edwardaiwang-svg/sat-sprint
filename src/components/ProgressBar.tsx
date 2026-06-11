// A thin progress bar used at the top of a practice set.
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden>
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
