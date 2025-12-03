import { useContext } from 'react'
import { Option, Tabs, Box } from '@island.is/island-ui/core'
import { FormsContext } from '../../../context/FormsContext'
import { Outlet } from 'react-router-dom'
import { FormsLocationState } from '../../../lib/utils/interfaces'
import { TabType } from '@island.is/form-system/ui'

const DASHBOARD_TABS: TabType[] = [
  {
    id: 'forms',
    label: 'Form',
  },
  {
    id: 'admin',
    label: 'Kerfisstjórnun',
  },
]

export const FormsHeader = () => {
  const { location, setLocation, forms } = useContext(FormsContext)

  const onTabChange = (tabId: string) => {
    const isValidLocation = (value: string): value is FormsLocationState => {
      return ['forms', 'admin'].includes(value)
    }

    if (isValidLocation(tabId)) {
      setLocation(tabId as FormsLocationState)
    } else {
      console.warn(`Invalid location: ${tabId}`)
    }
  }

  return (
    <Tabs
      label="tabs"
      tabs={DASHBOARD_TABS.map((tab) => ({
        id: tab.id,
        label: tab.label,
        content: <Outlet />,
      }))}
      onChange={onTabChange}
      onlyRenderSelectedTab
      variant="default"
      selected={location}
    />
  )
}
