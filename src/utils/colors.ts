export const BRAND = {
  green: '#228B22',
  blue: '#00BFFF',
  orange: '#FF7F50',
  dark: '#1a1a2e',
  gray: '#f0f0f0',
} as const

export const STATUS_COLORS: Record<string, string> = {
  'Existing': BRAND.green,
  'Under Construction': BRAND.blue,
  'Planned': BRAND.orange,
  'Potential': '#9ca3af',
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Committed': '#3b82f6',
  'Recommended': '#eab308',
  'Potential': '#f97316',
}

export const TIER_COLORS: Record<number, string> = {
  1: '#228B22',
  2: '#eab308',
  3: '#f97316',
  4: '#ef4444',
}

export function scoreColor(score: number): string {
  if (score >= 4) return '#228B22'
  if (score >= 3) return '#eab308'
  if (score >= 2) return '#f97316'
  return '#ef4444'
}

export function demandColor(mw: number): string {
  if (mw >= 300) return '#1e3a5f'
  if (mw >= 100) return '#2563eb'
  if (mw >= 50) return '#60a5fa'
  if (mw >= 20) return '#93c5fd'
  return '#dbeafe'
}
