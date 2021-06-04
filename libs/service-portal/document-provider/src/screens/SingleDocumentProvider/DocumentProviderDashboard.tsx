import React from 'react'
import { useLocale } from '@island.is/localization'
import { GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { StatisticBox } from '../../components/StatisticBox/StatisticBox'
import { useGetProviderStatistics } from '../../shared/useGetProviderStatistics'
import { m } from '../../lib/messages'

interface Props {
  organisationId: string
  fromDate?: Date
  toDate?: Date
}
interface StatisticsBoxData {
  name: string
  value: number
}

export const DocumentProviderDashboard = ({
  organisationId,
  fromDate,
  toDate,
}: Props) => {
  const { formatMessage } = useLocale()
  const { statistics } = useGetProviderStatistics(
    organisationId,
    fromDate,
    toDate,
  )

  const data: StatisticsBoxData[] = [
    {
      name: formatMessage(m.statisticsBoxPublishedDocuments),
      value: statistics?.published || 0,
    },
    {
      name: formatMessage(m.statisticsBoxOpenedDocuments),
      value: statistics?.opened || 0,
    },
    {
      name: formatMessage(m.statisticsBoxNotifications),
      value: statistics?.notifications || 0,
    },
  ]

  return (
    <Box marginBottom={2}>
      {data && (
        <GridRow>
          {data.map((Data, index) => (
            <GridColumn span={['12/12', '3/12']} key={index}>
              <StatisticBox name={Data.name} value={Data.value} />
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}
