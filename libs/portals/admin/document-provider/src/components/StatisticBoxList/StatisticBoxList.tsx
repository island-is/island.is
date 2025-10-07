import React, { FC } from 'react'
import {
  Box,
  GridRow,
  GridColumn,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { StatisticBox } from '../StatisticBox/StatisticBox'
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
    return (
      <Box padding={0}>
        <GridRow>
          {[...Array(boxesPerRow)].map((_, index) => (
            <GridColumn span={['12/12', columnSpan]} key={index}>
              <Box padding={2}>
                <SkeletonLoader height={80} borderRadius="large" />
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </Box>
    )
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
