import { useState, useCallback } from 'react'
import { MapContainer } from '../Map/MapContainer'
import { DataTable } from '../Tables/DataTable'
import { StatCard } from '../StatCard'
import { STATUS_COLORS, TIER_COLORS } from '../../utils/colors'
import { scoreColor } from '../../utils/colors'
import { formatMW, formatCurrency, formatScore } from '../../utils/formatters'
import { createColumnHelper } from '@tanstack/react-table'
import type { Facility, Country, HubLink, TabId } from '../../types'

import facilitiesData from '../../data/facilities.json'
import countriesData from '../../data/countries.json'
import hubLinksData from '../../data/hub-links.json'
import sovereignData from '../../data/sovereign-ai-demand.json'

const facilities = facilitiesData as Facility[]
const countries = countriesData as Country[]
const hubLinks = hubLinksData as HubLink[]
const sovereignMeta = sovereignData as { metadata: Record<string, unknown>; countries: unknown[] }
const africaCtx = (sovereignMeta.metadata as Record<string, unknown>).africaMarketContext as Record<string, unknown> | undefined

const statusBreakdown = (() => {
  const groups: Record<string, { count: number; mw: number; capex: number; committed: number }> = {}
  for (const f of facilities) {
    if (!groups[f.status]) groups[f.status] = { count: 0, mw: 0, capex: 0, committed: 0 }
    groups[f.status].count++
    groups[f.status].mw += f.mwCapacity
    groups[f.status].capex += f.capex
    groups[f.status].committed += f.committed
  }
  return groups
})()

const plannedCapex = (statusBreakdown['Planned']?.capex ?? 0) + (statusBreakdown['Under Construction']?.capex ?? 0)
const plannedCommitted = (statusBreakdown['Planned']?.committed ?? 0) + (statusBreakdown['Under Construction']?.committed ?? 0)
const fundingGap = plannedCapex - plannedCommitted

const facCol = createColumnHelper<Facility>()
const infraColumns = [
  facCol.accessor('name', { header: 'Facility' }),
  facCol.accessor('country', { header: 'Country' }),
  facCol.accessor('city', { header: 'City' }),
  facCol.accessor('operator', { header: 'Operator' }),
  facCol.accessor('status', {
    header: 'Status',
    cell: i => <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: STATUS_COLORS[i.getValue()] }}>{i.getValue()}</span>,
  }),
  facCol.accessor('type', { header: 'Type' }),
  facCol.accessor('mwCapacity', { header: 'MW', cell: i => formatMW(i.getValue()) }),
  facCol.accessor('capex', { header: 'CapEx $M', cell: i => formatCurrency(i.getValue()) }),
  facCol.accessor('committed', { header: 'Committed $M', cell: i => formatCurrency(i.getValue()) }),
  facCol.accessor(row => row.capex - row.committed, { id: 'gap', header: 'Gap $M', cell: i => {
    const v = i.getValue()
    return <span style={{ color: v > 0 ? '#ef4444' : '#228B22' }}>{formatCurrency(v)}</span>
  }}),
  facCol.accessor('wlcScore', {
    header: 'WLC',
    cell: i => {
      const v = i.getValue()
      return <span className="font-bold" style={{ color: scoreColor(v) }}>{formatScore(v)}</span>
    },
  }),
  facCol.accessor('tier', { header: 'Tier', cell: i => <span className="font-medium" style={{ color: TIER_COLORS[i.getValue()] }}>T{i.getValue()}</span> }),
]

const statuses = ['Existing', 'Under Construction', 'Planned'] as const

interface Props {
  activeTab: TabId
  onFacilityClick: (f: Facility) => void
}

export function InfrastructureTab({ activeTab, onFacilityClick }: Props) {
  const [showGrid, setShowGrid] = useState(false)
  const [showFibre, setShowFibre] = useState(false)

  const handleFacilityClick = useCallback((f: Facility) => {
    onFacilityClick(f)
    const flyTo = (window as unknown as Record<string, unknown>).__safariMapFlyTo as ((lat: number, lng: number) => void) | undefined
    flyTo?.(f.lat, f.lng)
  }, [onFacilityClick])

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 bg-gray-50/80 px-3 py-2 flex flex-wrap gap-2 items-center border-b border-gray-200">
        {statuses.map(status => {
          const g = statusBreakdown[status] ?? { count: 0, mw: 0 }
          return (
            <div key={status} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[status] }} />
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide leading-none">{status}</div>
                <div className="text-sm font-bold text-safari-dark leading-tight">{g.count} <span className="text-[10px] font-normal text-gray-400">({formatMW(g.mw)})</span></div>
              </div>
            </div>
          )
        })}
        <StatCard label="Total DCs" value={facilities.length} accent="border-l-safari-green-dark" />
        <StatCard label="Total MW" value={formatMW(facilities.reduce((s, f) => s + f.mwCapacity, 0))} accent="border-l-safari-green-mid" />
        <StatCard label="CapEx Needed" value={formatCurrency(plannedCapex)} accent="border-l-safari-orange" />
        <StatCard label="Committed" value={formatCurrency(plannedCommitted)} accent="border-l-safari-blue" />
        <StatCard label="Funding Gap" value={formatCurrency(fundingGap)} accent="border-l-red-500" textClass="text-red-600" />
        <div className="flex items-center gap-1 text-[10px] text-gray-500 ml-auto">{new Set(facilities.map(f => f.countryCode)).size} countries</div>
      </div>
      {africaCtx && (
        <div className="shrink-0 bg-white/80 px-3 py-1.5 flex flex-wrap gap-2 items-center border-b border-gray-100 text-[10px]">
          <span className="font-semibold text-gray-600 uppercase tracking-wider mr-1">Africa Market:</span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5"><strong className="text-safari-dark">{String(africaCtx.africaShareOfGlobal)}</strong> of global DC capacity</span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5"><strong className="text-safari-dark">{String(africaCtx.facilitiesCount)}</strong> facilities across <strong>{String(africaCtx.countriesWithFacilities)}</strong> countries</span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5">Market: <strong className="text-safari-green-dark">${String(africaCtx.marketValueBn2024)}B</strong> (2024) → <strong className="text-safari-green-dark">${String(africaCtx.marketValueBn2030)}B</strong> (2030)</span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5">CAGR: <strong className="text-safari-blue">{String(africaCtx.marketCAGR)}</strong></span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5">Africa AI Fund: <strong className="text-safari-orange">${String(africaCtx.africaAIFundBn)}B</strong></span>
          <span className="bg-safari-dark/5 rounded px-2 py-0.5">McKinsey: <strong>{String((africaCtx.keyProjections as Record<string, string>)?.mckinseyDemandGrowth)}</strong></span>
        </div>
      )}

      <div style={{ flex: '1 1 0%', minHeight: 0, position: 'relative' }}>
        <MapContainer tab={activeTab} facilities={facilities} countries={countries} hubLinks={hubLinks} choroplethMode="none" showGrid={showGrid} showFibre={showFibre} onFacilityClick={handleFacilityClick} />
        <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg shadow-lg p-2.5 text-[10px] z-10 space-y-1">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />{status}</div>
          ))}
          <div className="flex items-center gap-1.5 border-t border-gray-200 pt-1">
            <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#00BFFF" strokeWidth="2" strokeDasharray="3,3" /></svg>
            Hub Sharing Links
          </div>
          {showGrid && <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-amber-500" /> Transmission Lines</div>}
          {showFibre && <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-violet-500" /> Fibre Optic</div>}
        </div>
        <div className="absolute top-3 left-3 bg-white/95 rounded-lg shadow-lg p-2.5 z-10 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-700">
            <div className="relative">
              <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="sr-only peer" />
              <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-amber-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block" /> Electricity Grid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-700">
            <div className="relative">
              <input type="checkbox" checked={showFibre} onChange={e => setShowFibre(e.target.checked)} className="sr-only peer" />
              <div className="w-8 h-4 bg-gray-200 rounded-full peer-checked:bg-violet-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-500 inline-block" /> Fibre Network</span>
          </label>
        </div>
      </div>

      <div className="h-56 border-t border-gray-200 bg-white shrink-0 overflow-hidden">
        <DataTable data={facilities} columns={infraColumns} onRowClick={handleFacilityClick} searchPlaceholder="Search data centres..." compact showColumnFilters />
      </div>
    </div>
  )
}
