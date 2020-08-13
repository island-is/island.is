import React, { FC } from 'react'
import { Statistic, StatisticProps } from '../Statistic/Statistic'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Statistics.treat'

export interface StatisticsProps {
  items: StatisticProps[]
}

export const Statistics: FC<StatisticsProps> = ({ items }) => {
  return (
    <div className={styles.container}
    >
      {items.map((fields, index) => (
        <Box key={index} display="flex" margin={1}>
          <Statistic {...fields} />
        </Box>
      ))}
    </div>
  )
}
