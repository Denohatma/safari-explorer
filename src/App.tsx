import { useState, lazy, Suspense } from 'react'
import { TabBar } from './components/TabBar'
import { RadarChart } from './components/Cards/RadarChart'
import { PolicyProfileCard } from './components/Cards/PolicyProfileCard'
import { InfrastructureTab } from './components/tabs/InfrastructureTab'
import { useActiveTab } from './hooks/useActiveTab'
import { STATUS_COLORS, TIER_COLORS } from './utils/colors'
import { formatMW, formatCurrency, formatScore } from './utils/formatters'
import type { Facility, Country } from './types'

const base = import.meta.env.BASE_URL

const SovereignTab = lazy(() => import('./components/tabs/SovereignTab').then(m => ({ default: m.SovereignTab })))
const EnablingTab = lazy(() => import('./components/tabs/EnablingTab').then(m => ({ default: m.EnablingTab })))
const IntelligenceTab = lazy(() => import('./components/tabs/IntelligenceTab').then(m => ({ default: m.IntelligenceTab })))
const ContactTab = lazy(() => import('./components/tabs/ContactTab').then(m => ({ default: m.ContactTab })))

export default function App() {
  const { activeTab, setTab } = useActiveTab()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  return (
    <>
      <header className="bg-safari-dark text-white px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img src={`${base}afcen-icon.svg`} alt="AfCEN" className="w-9 h-9" />
          <div>
            <h1 className="text-sm font-semibold font-[family-name:var(--font-title)] leading-tight tracking-wide">InvestIQ: Data Centres</h1>
            <p className="text-[10px] text-gray-400">Africa Data Centre Intelligence Platform</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
          <span>Powered by</span>
          <img src={`${base}afcen-full.png`} alt="Africa Climate and Energy Nexus" className="h-6 opacity-80" />
        </div>
      </header>

      <TabBar activeTab={activeTab} onTabChange={setTab} />

      {activeTab === 'infrastructure' ? (
        <InfrastructureTab activeTab={activeTab} onFacilityClick={setSelectedFacility} />
      ) : (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
          {activeTab === 'sovereign' ? (
            <SovereignTab />
          ) : activeTab === 'enabling' ? (
            <EnablingTab onCountryClick={setSelectedCountry} />
          ) : activeTab === 'intelligence' ? (
            <IntelligenceTab />
          ) : (
            <ContactTab />
          )}
        </Suspense>
      )}

      {selectedFacility && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedFacility(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-t-[3px] border-t-safari-green" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold font-[family-name:var(--font-title)] text-safari-dark">{selectedFacility.name}</h2>
                  <p className="text-sm text-gray-500">{selectedFacility.operator} — {selectedFacility.city}, {selectedFacility.country}</p>
                </div>
                <button onClick={() => setSelectedFacility(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[selectedFacility.status] }}>{selectedFacility.status}</span>
                <span style={{ color: TIER_COLORS[selectedFacility.tier] }} className="font-medium">Tier {selectedFacility.tier}</span>
                <span className="text-gray-500">WLC: {formatScore(selectedFacility.wlcScore)}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2 text-sm">
                  <div><span className="text-gray-500">Capacity:</span> <span className="font-medium">{formatMW(selectedFacility.mwCapacity)}</span></div>
                  <div><span className="text-gray-500">CapEx:</span> <span className="font-medium">{formatCurrency(selectedFacility.capex)}</span></div>
                  <div><span className="text-gray-500">Committed:</span> <span className="font-medium">{formatCurrency(selectedFacility.committed)}</span></div>
                  <div><span className="text-gray-500">Type:</span> <span className="font-medium">{selectedFacility.type}</span></div>
                </div>
                <RadarChart scores={selectedFacility.scores} size={180} />
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Location Prerequisites</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(selectedFacility.scores).map(([dim, score]) => {
                    const bg = score >= 4 ? 'bg-green-100 text-green-800' : score >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    return (
                      <div key={dim} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-gray-50">
                        <span className="text-gray-600 truncate mr-1">{dim}</span>
                        <span className={`px-1.5 py-0.5 rounded font-medium ${bg}`}>{score}/5</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCountry && <PolicyProfileCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />}
    </>
  )
}
