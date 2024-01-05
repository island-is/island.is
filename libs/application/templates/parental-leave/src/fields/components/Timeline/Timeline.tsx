import React, { FC } from 'react'
import { useWindowSize } from 'react-use'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { Panel } from './Panel'
import { Chart } from './Chart'
import * as styles from './Timeline.css'

export interface TimelinePeriod {
  actualDob?: boolean
  startDate: string
  endDate: string
  ratio: string
  duration: string
  title: string
  color?: string
  canDelete?: boolean
  rawIndex: number
}

interface TimelineProps {
  editable?: boolean
  initDate: Date
  periods: TimelinePeriod[]
  spanInMonths?: number
  title: string
  titleSmall?: string
  onDeletePeriod?: (startDate: string) => void
}

export const Timeline: FC<React.PropsWithChildren<TimelineProps>> = ({
  editable = true,
  initDate,
  periods,
  spanInMonths = 24,
  title,
  titleSmall,
  onDeletePeriod,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const dayWidth = isMobile ? 2 : 3

  return (
    <Box display="flex" width="full" position="relative">
      <Panel
        initDate={initDate}
        title={title}
        titleSmall={titleSmall || title}
        periods={periods}
        isMobile={isMobile}
        editable={editable}
        onDeletePeriod={onDeletePeriod}
      />

      <Chart
        initDate={initDate}
        periods={periods}
        dayWidth={dayWidth}
        spanInMonths={spanInMonths}
      />

      <Box className={styles.scrollGradient} />
    </Box>
  )
}
