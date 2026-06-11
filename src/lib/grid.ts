// Matching logic for "grid-in" (student-produced response) math answers.
// We compare numerically so equivalent forms all count as correct:
//   "3/4", "0.75", ".75"  -> all equal
//   "-3", "−3" (unicode minus) -> both accepted

export function parseGrid(value: string): number | null {
  // Normalize a unicode minus sign to a plain hyphen, drop spaces, and strip
  // thousands commas / dollar signs ("90,000" and "$66" should still count).
  const v = value.trim().replace(/−/g, '-').replace(/[\s,$]/g, '')
  if (!v) return null

  // Fraction form a/b (allows decimals in either part, e.g. "1.5/3").
  const frac = v.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/)
  if (frac) {
    const num = parseFloat(frac[1])
    const den = parseFloat(frac[2])
    if (den === 0) return null
    return num / den
  }

  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** True if the student's typed value equals the stored answer (within rounding). */
export function gridMatch(userValue: string, answer: string): boolean {
  const u = parseGrid(userValue)
  const a = parseGrid(answer)
  if (u === null || a === null) return false
  return Math.abs(u - a) < 1e-6
}
