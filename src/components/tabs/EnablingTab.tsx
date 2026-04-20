import { useMemo } from 'react'
import { DataTable } from '../Tables/DataTable'
import { scoreColor } from '../../utils/colors'
import { DIMENSION_LABELS } from '../../types'
import type { Country } from '../../types'
import { createColumnHelper } from '@tanstack/react-table'

import countriesData from '../../data/countries.json'

const countries = countriesData as Country[]
const DIM_KEYS = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11'] as const
const SCORE_COLORS = ['#ef4444', '#f97316', '#eab308', '#228B22', '#006811']

interface EnvRow {
  rank: number; name: string; code: string; avgScore: number
  D1: number; D2: number; D3: number; D4: number; D5: number; D6: number
  D7: number; D8: number; D9: number; D10: number; D11: number
  taSupport: string
}

const envCol = createColumnHelper<EnvRow>()

function dimCell(v: number) {
  const bg = v >= 4 ? 'bg-green-100 text-green-800' : v >= 3 ? 'bg-yellow-100 text-yellow-800' : v >= 2 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
  return <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${bg}`}>{v}</span>
}

const envColumns = [
  envCol.accessor('rank', { header: '#' }),
  envCol.accessor('name', { header: 'Country', cell: i => <span className="font-medium">{i.getValue()}</span> }),
  envCol.accessor('avgScore', {
    header: 'Avg',
    cell: i => {
      const v = i.getValue()
      return <span className="font-bold" style={{ color: scoreColor(v) }}>{v.toFixed(1)}</span>
    },
  }),
  ...DIM_KEYS.map(dk =>
    envCol.accessor(row => row[dk], {
      id: dk,
      header: dk,
      cell: i => dimCell(i.getValue()),
    })
  ),
  envCol.accessor('taSupport', {
    header: 'TA Support Needed',
    cell: i => <span className="max-w-xs block text-[10px] leading-relaxed" title={i.getValue()}>{i.getValue()}</span>,
  }),
]

interface Props {
  onCountryClick: (c: Country) => void
}

export function EnablingTab({ onCountryClick }: Props) {
  const envRows = useMemo(() => {
    return [...countries]
      .sort((a, b) => b.avgDimensionScore - a.avgDimensionScore)
      .map((c, idx) => {
        const ds = c.dimensionScores
        const weakDims = DIM_KEYS.filter(k => ds[k] <= 2)
        const ta = weakDims.length === 0
          ? 'Investment-ready — maintain standards'
          : `Strengthen: ${weakDims.map(k => DIMENSION_LABELS[k]).join(', ')}`
        return {
          rank: idx + 1, name: c.name, code: c.code, avgScore: c.avgDimensionScore,
          D1: ds.D1, D2: ds.D2, D3: ds.D3, D4: ds.D4, D5: ds.D5, D6: ds.D6,
          D7: ds.D7, D8: ds.D8, D9: ds.D9, D10: ds.D10, D11: ds.D11,
          taSupport: ta,
        } satisfies EnvRow
      })
  }, [])

  const continentAvgs = useMemo(() => {
    const sums: Record<string, number> = {}
    for (const k of DIM_KEYS) sums[k] = 0
    for (const c of countries) {
      for (const k of DIM_KEYS) sums[k] += c.dimensionScores[k]
    }
    const n = countries.length
    return DIM_KEYS.map(k => ({ dim: k, label: DIMENSION_LABELS[k], avg: +(sums[k] / n).toFixed(1) }))
  }, [])

  const scoreDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]
    for (const c of countries) {
      const bucket = Math.min(4, Math.max(0, Math.round(c.avgDimensionScore) - 1))
      dist[bucket]++
    }
    return dist
  }, [])

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 bg-gray-50/80 px-3 py-2 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mr-1">Score Distribution:</span>
          {[1,2,3,4,5].map((s, idx) => (
            <div key={s} className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SCORE_COLORS[idx] }} />
              <div>
                <div className="text-[10px] text-gray-500">Score {s}</div>
                <div className="text-sm font-bold" style={{ color: SCORE_COLORS[idx] }}>{scoreDist[idx]}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mr-1">Continent Avg:</span>
          {continentAvgs.map(d => (
            <div key={d.dim} className="bg-white rounded border border-gray-200 px-2 py-1 shadow-sm text-center" title={d.label}>
              <div className="text-[9px] text-gray-400">{d.dim}</div>
              <div className="text-xs font-bold" style={{ color: scoreColor(d.avg) }}>{d.avg}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 bg-white px-4 py-1.5 border-b border-gray-100 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-gray-500">
        {DIM_KEYS.map(k => (
          <span key={k}><strong className="text-gray-700">{k}</strong>: {DIMENSION_LABELS[k]}</span>
        ))}
      </div>
      <div className="flex-1 min-h-0 bg-white overflow-hidden">
        <DataTable
          data={envRows}
          columns={envColumns}
          searchPlaceholder="Search countries..."
          compact
          showColumnFilters
          onRowClick={(row: EnvRow) => {
            const c = countries.find(c => c.code === row.code)
            if (c) onCountryClick(c)
          }}
        />
      </div>
    </div>
  )
}
