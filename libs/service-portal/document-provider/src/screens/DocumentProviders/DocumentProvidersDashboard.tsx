import React from 'react'

import { Box,GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { StatisticBox } from '../../components/StatisticBox/StatisticBox'
import { m } from '../../lib/messages'
import { useGetProviderStatistics } from '../../shared/useGetProviderStatistics'

interface Props {
  organisationsCount: number
  fromDate?: Date
  toDate?: Date
}
interface StatisticsBoxData {
  name: string
  value: number
}

export const DocumentProvidersDashboard = ({
  organisationsCount,
  fromDate,
  toDate,
}: Props) => {
  const { formatMessage } = useLocale()

  const { statistics } = useGetProviderStatistics(undefined, fromDate, toDate)

  const data: StatisticsBoxData[] = [
    {
      name: formatMessage(m.statisticsBoxOrganisationsCount),
      value: organisationsCount,
    },
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
          {data.map((statData, index) => (
            <GridColumn span={['12/12', '3/12']} key={index}>
              <StatisticBox name={statData.name} value={statData.value} />
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}
