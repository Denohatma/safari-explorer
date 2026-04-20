export function formatMW(mw: number): string {
  return `${mw.toLocaleString()} MW`
}

export function formatCurrency(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`
  return `$${millions.toLocaleString()}M`
}

export function formatScore(score: number): string {
  return score.toFixed(2)
}
