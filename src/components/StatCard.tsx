interface Props {
  label: string
  value: React.ReactNode
  accent: string
  textClass?: string
}

export function StatCard({ label, value, accent, textClass = 'text-safari-dark' }: Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-[3px] ${accent} px-3 py-1.5 shadow-sm`}>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-bold ${textClass}`}>{value}</div>
    </div>
  )
}
