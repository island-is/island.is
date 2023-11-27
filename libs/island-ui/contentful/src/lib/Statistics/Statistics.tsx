import React, { FC } from 'react'
import Background from '../Background/Background'
import { Statistic, StatisticProps } from '../Statistic/Statistic'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Statistics.css'

export interface StatisticsProps {
  statistics: StatisticProps[]
}

export const Statistics: FC<React.PropsWithChildren<StatisticsProps>> = ({
  statistics,
  ...props
}) => {
  return (
    <Background backgroundPattern="dotted" paddingY={10}>
      <div className={styles.container}>
        {statistics.map((stat, index) => (
          <Box key={index} display="flex" margin={1}>
            <Statistic {...stat} />
          </Box>
        ))}
      </div>
    </Background>
  )
}

export default Statistics
