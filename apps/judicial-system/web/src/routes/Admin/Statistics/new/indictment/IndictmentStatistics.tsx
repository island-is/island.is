import { useEffect, useState } from 'react'

import { Box, Tabs } from '@island.is/island-ui/core'
import { PageHeader } from '@island.is/judicial-system-web/src/components'

import { StatisticHeader } from '../shared/StatisticHeader'
import StatisticPageLayout from '../shared/StatisticPageLayout'
import { StatisticReturnButton } from '../shared/StatisticReturnButton'
import { GeneralStatistics } from './GeneralStatistics'
import { SubpoenaStatistics } from './SubpoenaStatistics'

const IndictmentStatistics = () => {
  const [activeTab, setActiveTab] = useState<string>('general')

  useEffect(() => {
    window.localStorage.setItem('CASE_ACTIVE_TAB', activeTab)
  }, [activeTab])

  return (
    <StatisticPageLayout>
      <PageHeader title="Tölfræði úr sakamálum" />
      <Box>
        <StatisticReturnButton />
        <StatisticHeader title="Tölfræði úr sakamálum" />
        <Tabs
          size="md"
          contentBackground="white"
          selected={activeTab}
          label=""
          onChange={(tabId) => {
            setActiveTab(tabId)
          }}
          tabs={[
            {
              id: 'general',
              label: 'Almenn',
              content: <GeneralStatistics />,
            },
            {
              id: 'subpoenas',
              label: 'Fyrirköll',
              content: <SubpoenaStatistics />,
            },
          ]}
        />
      </Box>
    </StatisticPageLayout>
  )
}

export default IndictmentStatistics
