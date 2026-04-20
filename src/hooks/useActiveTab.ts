import { useState, useEffect, useCallback } from 'react'
import type { TabId } from '../types'

const VALID_TABS: TabId[] = ['infrastructure', 'sovereign', 'enabling', 'intelligence', 'contact']

function getTabFromHash(): TabId {
  const hash = window.location.hash.slice(1) as TabId
  return VALID_TABS.includes(hash) ? hash : 'infrastructure'
}

export function useActiveTab() {
  const [activeTab, setActiveTab] = useState<TabId>(getTabFromHash)

  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const setTab = useCallback((tab: TabId) => {
    window.location.hash = tab
    setActiveTab(tab)
  }, [])

  return { activeTab, setTab }
}
