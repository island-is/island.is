import React, { FC, useRef } from 'react'
import subMonths from 'date-fns/subMonths'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import toDate from 'date-fns/toDate'
import closestIndexTo from 'date-fns/closestIndexTo'
import isSameDay from 'date-fns/isSameDay'
import addMonths from 'date-fns/addMonths'
import endOfMonth from 'date-fns/endOfMonth'
import parseISO from 'date-fns/parseISO'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useDrag } from '../utils'
import * as styles from './Chart.css'
import { TimelinePeriod } from './Timeline'
import { useLocale } from '@island.is/localization'

const ChartMonths: FC<
  React.PropsWithChildren<{
    initDate: Date
    rowWidth: string
    chartColumns: string
    totalDays: Date[]
    lastDayInTimespan: Date
  }>
> = ({ initDate, rowWidth, chartColumns, totalDays, lastDayInTimespan }) => {
  const { formatDateFns } = useLocale()
  return (
    <Box
      className={styles.row}
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
          const isLastDayAvailable = isSameDay(lastDayInTimespan, day)
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
                  {(isFirstDayOfMonth || index === 0) &&
                    formatDateFns(day, 'MMM yyyy')}
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
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export const Chart: FC<
  React.PropsWithChildren<{
    initDate: Date
    periods: TimelinePeriod[]
    dayWidth: number
    spanInMonths?: number
  }>
> = ({ initDate, dayWidth, periods, spanInMonths = 18 }) => {
  const padStart = subMonths(initDate, 1).setDate(1)
  const lastDayInTimespan = addMonths(initDate, spanInMonths)
  const padEnd = endOfMonth(lastDayInTimespan)
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
        lastDayInTimespan={lastDayInTimespan}
      />

      {periods.map((p, index) => {
        const periodStartDate = parseISO(p.startDate)
        const periodEndDate = parseISO(p.endDate)
        const colStart =
          (closestIndexTo(toDate(periodStartDate), totalDays) ?? 0) + 1
        const colEnd =
          (closestIndexTo(toDate(periodEndDate), totalDays) ?? 0) + 1

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
                  gridColumn: `${colStart}/${colEnd}`,
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
