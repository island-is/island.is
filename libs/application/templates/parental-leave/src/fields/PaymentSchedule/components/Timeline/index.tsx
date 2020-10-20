import React, { FC, useRef, useState } from 'react'
import {
  format,
  subMonths,
  eachDayOfInterval,
  toDate,
  closestIndexTo,
  isSameDay,
  addMonths,
  endOfMonth,
} from 'date-fns'
import { useWindowSize } from 'react-use'
import { useDrag } from './utils'

import * as styles from './Timeline.treat'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

export interface Period {
  startDate: string
  endDate: string
  title: string
  color?: string
  canDelete?: boolean
}

const Panel: FC<{
  initDate: Date
  title: string
  titleSmall: string
  periods: Period[]
  isMobile: boolean
}> = ({ initDate, title, titleSmall, periods, isMobile }) => {
  const formatStyle = isMobile ? 'dd MMM' : 'dd MMM yyyy'
  const titleLabel = isMobile ? titleSmall : title

  return (
    <Box className={styles.panel}>
      <Box position="relative" className={styles.panelRow}>
        <Text variant="small">
          <Text variant="small" as="span" fontWeight="semiBold" color="blue400">
            {titleLabel}
          </Text>
          <br />
          {format(initDate, 'dd MMM yyyy')}
        </Text>
        <Box position="absolute" className={styles.firstPanelRowSeparator} />
      </Box>
      {periods.map((p, index) => {
        return (
          <Box className={styles.panelRow} key={index}>
            <Text variant="small">
              <Text variant="small" as="span" fontWeight="semiBold">
                {p.title}
              </Text>
              <br />
              {format(new Date(p.startDate), formatStyle)}—
              {format(new Date(p.endDate), formatStyle)}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}

const ChartMonths: FC<{
  initDate: Date
  rowWidth: string
  chartColumns: string
  totalDays: Date[]
  lastDayAvailableForLeave: Date
}> = ({
  initDate,
  rowWidth,
  chartColumns,
  totalDays,
  lastDayAvailableForLeave,
}) => {
  return (
    <Box
      className={styles.row}
      position="relative"
      justifyContent="flexEnd"
      style={{
        width: rowWidth,
        left: '-1px',
      }}
    >
      <Box
        className={styles.duration}
        style={{
          gridTemplateColumns: chartColumns,
        }}
      >
        {totalDays.map((day, index) => {
          const isInitDay = isSameDay(initDate, day)
          const isLastDayAvailable = isSameDay(lastDayAvailableForLeave, day)
          const isFirstDayOfMonth = totalDays[index].getDate() === 1
          const height = isFirstDayOfMonth || index === 0 ? 14 : 0
          const color = isInitDay ? theme.color.yellow200 : theme.color.dark200
          return (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              justifyContent="flexEnd"
            >
              <Box className={styles.chartMonth}>
                <Text variant="small">
                  {(isFirstDayOfMonth || index === 0) && format(day, 'MMM yy')}
                  &nbsp;
                </Text>
                {isInitDay && <Box className={styles.highlightDay} />}
                {isLastDayAvailable && <Box className={styles.highlightDay} />}
              </Box>
              <Box
                style={{
                  height: `${height}px`,
                  borderLeft: `1px solid ${color}`,
                }}
              ></Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

const Chart: FC<{
  initDate: Date
  periods: Period[]
  dayWidth: number
  spanInMonths?: number
}> = ({ initDate, dayWidth, periods, spanInMonths = 18 }) => {
  const padStart = subMonths(initDate, 1).setDate(1)
  const lastDayAvailableForLeave = addMonths(initDate, spanInMonths)
  const padEnd = endOfMonth(lastDayAvailableForLeave)
  const totalDays = eachDayOfInterval({
    start: padStart,
    end: padEnd,
  })

  const chartColumns = `repeat(${totalDays.length}, ${dayWidth}px)`
  const chartRowWidth = `${totalDays.length * dayWidth}px`

  const chartRef = useRef<HTMLDivElement>(null)
  const scrollLeft = useRef<number>(0)
  const scrollVelocity = useRef<number>(0)
  let momentumId: number

  const beginMomentumTracking = () => {
    cancelMomentumTracking()
    momentumId = requestAnimationFrame(momentumLoop)
  }

  const cancelMomentumTracking = () => {
    cancelAnimationFrame(momentumId)
  }

  const momentumLoop = () => {
    if (chartRef.current) {
      chartRef.current.scrollLeft += scrollVelocity.current
      scrollVelocity.current *= 0.95
      if (Math.abs(scrollVelocity.current) > 0.5) {
        momentumId = requestAnimationFrame(momentumLoop)
      } else {
        cancelMomentumTracking()
      }
    }
  }

  const dragBind = useDrag({
    onDragMove(deltaX) {
      if (chartRef.current) {
        const prevScrollLeft = chartRef.current.scrollLeft
        chartRef.current.scrollLeft = scrollLeft.current - deltaX
        scrollVelocity.current = chartRef.current.scrollLeft - prevScrollLeft
      }
    },
    onDragStart() {
      cancelMomentumTracking()
      scrollLeft.current = chartRef.current?.scrollLeft || 0
      if (chartRef.current) {
        chartRef.current.style.cursor = 'grabbing'
        chartRef.current.style.userSelect = 'none'
      }
    },
    onDragEnd() {
      if (chartRef.current) {
        chartRef.current.style.cursor = 'grab'
        chartRef.current.style.removeProperty('user-select')
        beginMomentumTracking()
      }
    },
  })

  return (
    <Box
      ref={chartRef}
      {...dragBind}
      className={styles.chartContainer}
      onWheel={cancelMomentumTracking}
    >
      <ChartMonths
        initDate={initDate}
        rowWidth={chartRowWidth}
        chartColumns={chartColumns}
        totalDays={totalDays}
        lastDayAvailableForLeave={lastDayAvailableForLeave}
      />

      {periods.map((p, index) => {
        const periodStartDate = new Date(p.startDate)
        const periodEndDate = new Date(p.endDate)

        return (
          <Box
            key={index}
            className={styles.row}
            style={{ width: chartRowWidth }}
          >
            <Box
              className={styles.duration}
              style={{
                gridTemplateColumns: chartColumns,
              }}
            >
              <Box
                className={styles.period}
                style={{
                  backgroundColor: p.color || theme.color.blue200,
                  gridColumn: `${
                    closestIndexTo(toDate(periodStartDate), totalDays) + 1
                  }/${closestIndexTo(toDate(periodEndDate), totalDays) + 1}`,
                }}
              ></Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

interface TimelineProps {
  initDate: Date
  periods: Period[]
  spanInMonths?: number
  title: string
  titleSmall?: string
  onDeletePeriod?: (index: number) => void
}

const Timeline: FC<TimelineProps> = ({
  initDate,
  periods,
  spanInMonths = 18,
  title,
  titleSmall,
  onDeletePeriod,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const dayWidth = isMobile ? 2 : 3

  return (
    <Box display="flex" width="full">
      <Panel
        initDate={initDate}
        title={title}
        titleSmall={titleSmall || title}
        periods={periods}
        isMobile={isMobile}
      />
      <Chart
        initDate={initDate}
        periods={periods}
        dayWidth={dayWidth}
        spanInMonths={spanInMonths}
      />
    </Box>
  )
}

export default Timeline
