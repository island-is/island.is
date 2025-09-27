import React, { FC } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { StatisticBox } from '../StatisticBox/StatisticBox'
import { DocumentProvidersLoading } from '../DocumentProvidersLoading/DocumentProvidersLoading'
import { StatisticsBoxData } from '../../lib/types'

interface Props {
  statistics: Array<StatisticsBoxData>
  loading: boolean
}

export const StatisticBoxList: FC<React.PropsWithChildren<Props>> = ({
  statistics,
  loading,
}) => {
  if (loading) {
    return <DocumentProvidersLoading />
  }

  return (
    <Box padding={0}>
      {statistics && (
        <GridRow>
          {statistics.map((statData, index) => (
            <GridColumn span={['12/12', '4/12']} key={index}>
              <StatisticBox name={statData.name} value={statData.value} />
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}
