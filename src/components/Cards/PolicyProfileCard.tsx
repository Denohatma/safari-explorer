import type { Country } from '../../types'
import { scoreColor, TIER_COLORS } from '../../utils/colors'

interface Props {
  country: Country
  onClose: () => void
}

const D5_LABELS: Record<string, string> = {
  dataProtection: 'Data Protection Law',
  permitting: 'Permitting Timeline',
  ruleOfLaw: 'Rule of Law Index',
  politicalStability: 'Political Stability',
  sezIncentives: 'SEZ Incentives',
  cyberLaw: 'Cyber Law',
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 4 ? 'bg-green-100 text-green-800' : score >= 3 ? 'bg-yellow-100 text-yellow-800' : score >= 2 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${bg}`}>{score}/5</span>
}

export function PolicyProfileCard({ country, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border-t-[3px] border-t-safari-blue" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-title)] text-safari-dark">{country.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>
          <div className="flex gap-3 mt-2">
            <div className="text-sm">
              <span className="text-gray-500">Policy Readiness:</span>{' '}
              <span className="font-semibold" style={{ color: scoreColor(country.policyReadiness) }}>
                {country.policyReadiness.toFixed(1)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Security (D12):</span>{' '}
              <ScoreBadge score={country.d12Score} />
            </div>
            <div className="text-sm">
              <span className="text-gray-500">DM Factor:</span>{' '}
              <span className="font-medium">{country.dmFactor}</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Regulatory & Political (D5)</h3>
            <div className="space-y-2">
              {Object.entries(country.d5Details).map(([key, detail]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">{D5_LABELS[key] ?? key}</span>
                    <span className="text-xs text-gray-400 ml-2">{detail.label}</span>
                  </div>
                  <ScoreBadge score={detail.score} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Security Assessment</h3>
            <p className="text-sm text-gray-600">{country.d12Details}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Digital Maturity</h3>
            <p className="text-sm text-gray-600">Factor: {country.dmFactor} — {country.dmRationale}</p>
          </div>

          {country.policyReadiness < 3 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">
                {country.d5Details.dataProtection?.score <= 2
                  ? 'No comprehensive data protection law — high risk for sovereign workloads.'
                  : country.d5Details.politicalStability?.score <= 2
                  ? 'Political instability risk — enhanced due diligence required.'
                  : 'Policy environment below threshold — targeted risk mitigation investment required.'}
              </p>
            </div>
          )}
        </div>

        <div className="p-5 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold">{country.totalDemandMW} MW</div>
            <div className="text-xs text-gray-500">Total Demand</div>
          </div>
          <div>
            <div className="text-lg font-semibold">${country.electricityTariff.toFixed(2)}/kWh</div>
            <div className="text-xs text-gray-500">Tariff</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{country.internetPct}%</div>
            <div className="text-xs text-gray-500">Internet</div>
          </div>
        </div>
      </div>
    </div>
  )
}
