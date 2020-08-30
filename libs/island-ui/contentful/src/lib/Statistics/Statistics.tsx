import React, { FC } from 'react'
import { Statistic, StatisticProps } from '../Statistic/Statistic'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Statistics.treat'

export interface StatisticsProps {
  statistics: StatisticProps[]
}

export const Statistics: FC<StatisticsProps> = ({ statistics, ...props }) => {
  return (
    <div className={styles.container}>
      {statistics.map((stat, index) => (
        <Box key={index} display="flex" margin={1}>
          <Statistic {...stat} />
        </Box>
      ))}
    </div>
  )
}

export default Statistics
