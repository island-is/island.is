import React, { FC, useRef } from 'react'
import format from 'date-fns/format'
import subMonths from 'date-fns/subMonths'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import toDate from 'date-fns/toDate'
import closestIndexTo from 'date-fns/closestIndexTo'
import isSameDay from 'date-fns/isSameDay'
import addMonths from 'date-fns/addMonths'
import endOfMonth from 'date-fns/endOfMonth'
import parseISO from 'date-fns/parseISO'

import { useWindowSize } from 'react-use'
import { useDrag } from '../utils'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Timeline.treat'

export interface TimelinePeriod {
  startDate: string
  endDate: string
  title: string
  color?: string
  canDelete?: boolean
}

const Panel: FC<{
  editable: boolean
  initDate: Date
  title: string
  titleSmall: string
  periods: TimelinePeriod[]
  isMobile: boolean
  onDeletePeriod?: (index: number) => void
}> = ({
  editable = true,
  initDate,
  title,
  titleSmall,
  periods,
  isMobile,
  onDeletePeriod,
}) => {
  const formatStyle = isMobile ? 'dd MMM' : 'dd MMM yyyy'
  const titleLabel = isMobile ? titleSmall : title

  return (
    <Box className={styles.panel}>
      <Box className={styles.panelRow}>
        <Text variant="small">
          <Text variant="small" as="span" fontWeight="semiBold" color="blue400">
            {titleLabel}
          </Text>
          <br />
          {format(initDate, 'dd MMM yyyy')}
        </Text>
        <Box className={styles.firstPanelRowSeparator} />
      </Box>
      {periods.map((p, index) => {
        return (
          <Box className={styles.panelRow} key={index}>
            {p.canDelete && editable && onDeletePeriod && (
              <Box
                className={styles.deleteIcon}
                onClick={() => onDeletePeriod(index)}
              >
                <Icon
                  color="dark200"
                  icon="removeCircle"
                  size="medium"
                  type="outline"
                />
              </Box>
            )}
            <Text variant="small">
              <Text variant="small" as="span" fontWeight="semiBold">
                {p.title}
              </Text>
              <br />
              {format(parseISO(p.startDate), formatStyle)}—
              {format(parseISO(p.endDate), formatStyle)}
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
  lastDayInTimespan: Date
}> = ({ initDate, rowWidth, chartColumns, totalDays, lastDayInTimespan }) => {
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
                    format(day, 'MMM yyyy')}
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

const Chart: FC<{
  initDate: Date
  periods: TimelinePeriod[]
  dayWidth: number
  spanInMonths?: number
}> = ({ initDate, dayWidth, periods, spanInMonths = 18 }) => {
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
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

interface TimelineProps {
  editable?: boolean
  initDate: Date
  periods: TimelinePeriod[]
  spanInMonths?: number
  title: string
  titleSmall?: string
  onDeletePeriod?: (index: number) => void
}

const Timeline: FC<TimelineProps> = ({
  editable = true,
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

export default Timeline
