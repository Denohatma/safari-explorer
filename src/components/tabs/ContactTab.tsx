import { useState, type FormEvent } from 'react'

const base = import.meta.env.BASE_URL

const INTEREST_OPTIONS = [
  'Market Analytics & Forecasts',
  'Investment Pipeline Tracking',
  'Policy & Regulatory Insights',
  'Sovereign AI Demand Modelling',
  'Technical Advisory Support',
  'Custom Research & Reports',
]

const FEATURES = [
  { icon: '📊', title: 'Market Analytics', desc: 'Real-time data centre market sizing, supply-demand tracking, and growth forecasts across 38 African markets.' },
  { icon: '💰', title: 'Investment Pipeline', desc: '$21B+ tracked CapEx across 34 projects — committed, recommended, and potential pipeline with funding gap analysis.' },
  { icon: '🏛', title: 'Sovereign AI Strategy', desc: '54-country sovereign demand model, sharing hub design, and minimum viable sovereign DC planning.' },
  { icon: '📋', title: 'Policy & Regulation', desc: '12-dimension enabling environment scorecard, data protection tracking, and technical assistance roadmaps.' },
  { icon: '🔬', title: 'Technical Advisory', desc: 'SAFARI GIS-MCDA site assessment, WLC scoring, and location prerequisite analysis for greenfield projects.' },
  { icon: '📈', title: 'Custom Research', desc: 'Bespoke market entry studies, operator benchmarking, and due diligence support for investors and DFIs.' },
]

interface FormData {
  name: string
  email: string
  organization: string
  role: string
  region: string
  interests: string[]
  message: string
}

const INITIAL_FORM: FormData = { name: '', email: '', organization: '', role: '', region: '', interests: [], message: '' }

export function ContactTab() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`InvestIQ Interest — ${form.organization || form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization}\nRole: ${form.role}\nRegion of Interest: ${form.region}\nAreas of Interest: ${form.interests.join(', ') || 'Not specified'}\n\nMessage:\n${form.message || '(none)'}`
    )
    window.open(`mailto:info@afcen.org?subject=${subject}&body=${body}`, '_self')
    setSubmitted(true)
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-safari-dark text-white px-6 py-10 text-center">
        <img src={`${base}afcen-icon.svg`} alt="AfCEN" className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-title)] leading-tight mb-3">
          Access Africa's Premier Data Centre Intelligence
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed">
          AfCEN's InvestIQ platform delivers real-time market analytics, investment pipeline tracking, and sovereign AI
          demand modelling across 54 African countries. Register your interest to access the full platform and receive
          tailored intelligence briefings.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-safari-green" /> 220+ Facilities Tracked</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-safari-blue" /> 54 Countries Assessed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-safari-orange" /> $21B+ Pipeline Monitored</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> 12-Dimension Scoring</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Feature cards */}
        <div className="mb-10">
          <h3 className="text-lg font-bold font-[family-name:var(--font-title)] text-safari-dark text-center mb-6">
            What You'll Get Access To
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="text-sm font-bold text-safari-dark mb-1">{f.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Why register */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-lg font-bold font-[family-name:var(--font-title)] text-safari-dark">
              Why Register?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-safari-green/10 text-safari-green-dark flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                <div><strong className="text-safari-dark">Early Access</strong> — Be among the first to access quarterly market intelligence reports and investment alerts.</div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-safari-green/10 text-safari-green-dark flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                <div><strong className="text-safari-dark">Tailored Briefings</strong> — Receive intelligence matched to your region and sector focus.</div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-safari-green/10 text-safari-green-dark flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                <div><strong className="text-safari-dark">Network Access</strong> — Connect with operators, investors, and policymakers across the African DC ecosystem.</div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-safari-green/10 text-safari-green-dark flex items-center justify-center shrink-0 text-xs font-bold">4</span>
                <div><strong className="text-safari-dark">Decision Support</strong> — Data-driven insights for site selection, market entry, and capital allocation.</div>
              </div>
            </div>

            <div className="bg-safari-dark/5 rounded-xl p-4 text-[11px] text-gray-500 leading-relaxed">
              <strong className="text-safari-dark block mb-1">About AfCEN</strong>
              The Africa Climate and Energy Nexus (AfCEN) is a research and advisory platform focused on sustainable
              infrastructure investment across the continent. Our data centre intelligence division tracks
              over 220 facilities across 38 countries, backed by the SAFARI 12-dimension assessment framework.
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-xl border border-safari-green/30 shadow-lg p-8 text-center">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="text-lg font-bold text-safari-dark mb-2">Thank You for Your Interest</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your email client should have opened with a pre-filled message. Please send it to complete your registration.
                  Our team will review your request and get back to you within 2 business days.
                </p>
                <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM) }}
                  className="text-sm text-safari-green-dark hover:underline">
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 space-y-4">
                <h3 className="text-base font-bold text-safari-dark mb-1">Register Your Interest</h3>
                <p className="text-[11px] text-gray-400 -mt-3">Fields marked * are required</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name *" value={form.name} onChange={v => updateField('name', v)} required />
                  <Input label="Email Address *" type="email" value={form.email} onChange={v => updateField('email', v)} required />
                  <Input label="Organization *" value={form.organization} onChange={v => updateField('organization', v)} required />
                  <Input label="Role / Title" value={form.role} onChange={v => updateField('role', v)} />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Region / Country of Interest</label>
                  <select value={form.region} onChange={e => updateField('region', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-safari-green/50 focus:border-safari-green outline-none bg-white">
                    <option value="">Select a region...</option>
                    <option>Southern Africa</option>
                    <option>East Africa</option>
                    <option>West Africa</option>
                    <option>North Africa</option>
                    <option>Central Africa</option>
                    <option>Pan-African / Multi-region</option>
                    <option>Global (with Africa focus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-2">Areas of Interest</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-safari-dark">
                        <input type="checkbox" checked={form.interests.includes(opt)} onChange={() => toggleInterest(opt)}
                          className="w-4 h-4 rounded border-gray-300 text-safari-green focus:ring-safari-green/50" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Message (optional)</label>
                  <textarea value={form.message} onChange={e => updateField('message', e.target.value)}
                    rows={3} placeholder="Tell us about your needs or specific questions..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-safari-green/50 focus:border-safari-green outline-none resize-none" />
                </div>

                <button type="submit"
                  className="w-full py-3 bg-safari-green text-white font-semibold rounded-lg hover:bg-safari-green-dark transition-colors shadow-sm text-sm">
                  Register Interest
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  By registering, you agree to receive market intelligence communications from AfCEN. You can unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-safari-dark text-white px-6 py-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8 justify-between items-start text-[11px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={`${base}afcen-icon.svg`} alt="AfCEN" className="w-7 h-7" />
              <img src={`${base}afcen-full.png`} alt="Africa Climate and Energy Nexus" className="h-5 opacity-90" />
            </div>
            <div className="text-gray-400 leading-relaxed max-w-xs">
              Powering informed investment in Africa's digital infrastructure.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-300 mb-2">Contact</div>
            <div className="text-gray-400 space-y-1">
              <div>info@afcen.org</div>
              <div>Nairobi, Kenya</div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-300 mb-2">Platform</div>
            <div className="text-gray-400 space-y-1">
              <div>InvestIQ: Data Centres</div>
              <div>SAFARI Assessment Framework</div>
              <div>Sovereign AI Demand Model</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-white/10 text-[10px] text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Africa Climate and Energy Nexus. All rights reserved.
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-safari-green/50 focus:border-safari-green outline-none" />
    </div>
  )
}
