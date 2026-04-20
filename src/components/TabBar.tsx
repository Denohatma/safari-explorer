import type { TabId } from '../types'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'infrastructure', label: 'Data Centre Portfolio', icon: '🗺️' },
  { id: 'sovereign', label: 'Sovereign DC Pipeline', icon: '🏛' },
  { id: 'enabling', label: 'Enabling Environment', icon: '📋' },
  { id: 'intelligence', label: 'Market Intelligence', icon: '📰' },
  { id: 'contact', label: 'Contact Us', icon: '✉️' },
]

interface Props {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex bg-white border-b border-gray-200 px-2 sm:px-4 shrink-0">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 sm:px-4 py-3 text-sm font-medium border-b-[3px] transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-safari-green text-safari-green-dark'
              : 'border-transparent text-gray-500 hover:text-safari-dark hover:border-gray-300'
          }`}
        >
          <span className="mr-1.5">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
