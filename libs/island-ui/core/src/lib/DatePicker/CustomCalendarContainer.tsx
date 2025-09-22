import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { CalendarContainer } from 'react-datepicker'
import { Box, Tag } from '../..'
import * as styles from './DatePicker.css'

interface CustomCalendarContainerProps {
  children: React.ReactNode
  className?: string
  setDate: (startDate: Date | null, endDate?: Date | null) => void
  startDate: Date | null
  endDate: Date | null
  highlightWeekends?: boolean
  displaySelectInput?: boolean
  ranges?: { label: string; startDate: Date; endDate: Date }[]
}

const CustomCalendarContainer: React.FC<CustomCalendarContainerProps> = ({
  children,
  className,
  setDate,
  ranges,
  startDate,
  endDate,
  highlightWeekends,
  displaySelectInput,
}) => {
  const [weekCount, setWeekCount] = useState(0)
  const [weekendWidth, setWeekendWidth] = useState(82) // Default width for weekends
  const container = document.querySelector('.react-datepicker')

  useEffect(() => {
    if (highlightWeekends && container) {
      const updateWidth = () => {
        setWeekendWidth(
          ((container.getBoundingClientRect().width - theme.spacing[4]) / 7) *
            2,
        )
      }

      updateWidth()
      window.addEventListener('resize', updateWidth)

      return () => window.removeEventListener('resize', updateWidth)
    }
  }, [container])

  const weeks = container?.querySelectorAll('.react-datepicker__week')

  useEffect(() => {
    if (weeks) {
      setWeekCount(weeks.length)
    }
  }, [weeks])

  return (
    <CalendarContainer className={className}>
      <div className={styles.parentContainer}>
        <div
          style={
            highlightWeekends
              ? ({
                  '--weekend-width': `${weekendWidth}px`,
                } as React.CSSProperties)
              : undefined
          }
          className={cn(styles.calendarContainer, {
            [styles.weekendHeight[
              weekCount === 4
                ? 'fourWeeks'
                : weekCount === 5
                ? 'fiveWeeks'
                : 'sixWeeks'
            ]]: weekCount,
            [styles.displaySelectInput]: displaySelectInput,
          })}
        >
          {children}
        </div>
      </div>
      {ranges && (
        <Box className={styles.rangeContainer}>
          <Box
            display="flex"
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="spaceAround"
            paddingTop={2}
            columnGap={1}
          >
            {ranges?.map((range) => {
              const isSelected =
                range.startDate.getTime() === startDate?.getTime() &&
                range.endDate.getTime() === endDate?.getTime()
              return (
                <Tag
                  id={range.label}
                  key={range.label}
                  active={isSelected}
                  variant="blue"
                  outlined
                  onClick={() => {
                    if (!isSelected) setDate(range.startDate, range.endDate)
                    else setDate(null, null)
                  }}
                >
                  {range.label}
                </Tag>
              )
            })}
          </Box>
        </Box>
      )}
    </CalendarContainer>
  )
}

export default CustomCalendarContainer
