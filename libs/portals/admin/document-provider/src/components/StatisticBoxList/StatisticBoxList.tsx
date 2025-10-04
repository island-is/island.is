import React, { FC } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { StatisticBox } from '../StatisticBox/StatisticBox'
import { DocumentProvidersLoading } from '../DocumentProvidersLoading/DocumentProvidersLoading'
import { StatisticsBoxData } from '../../lib/types'

interface Props {
  statistics: Array<StatisticsBoxData>
  loading: boolean
  boxesPerRow?: 3 | 4
}

export const StatisticBoxList: FC<React.PropsWithChildren<Props>> = ({
  statistics,
  loading,
  boxesPerRow = 3,
}) => {
  // Calculate grid column span based on boxes per row
  const columnSpan = boxesPerRow === 4 ? '3/12' : '4/12'

  if (loading) {
    return <DocumentProvidersLoading />
  }

  return (
    <Box padding={0}>
      {statistics && (
        <GridRow>
          {statistics.map((statData, index) => (
            <GridColumn span={['12/12', columnSpan]} key={index}>
              <StatisticBox name={statData.name} value={statData.value} />
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}
