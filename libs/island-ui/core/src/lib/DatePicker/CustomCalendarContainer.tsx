import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CalendarContainer } from 'react-datepicker'
import { Box, Tag } from '../..'
import * as styles from './DatePicker.css'

interface CustomCalendarContainerProps {
  children: ReactNode
  className?: string
  setDate: (startDate: Date | null, endDate?: Date | null) => void
  startDate: Date | null
  endDate: Date | null
  highlightWeekends?: boolean
  displaySelectInput?: boolean
  ranges?: { label: string; startDate: Date; endDate: Date }[]
}

const CustomCalendarContainer: FC<CustomCalendarContainerProps> = ({
  children,
  className,
  setDate,
  ranges,
  startDate,
  endDate,
  highlightWeekends,
  displaySelectInput,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [weekCount, setWeekCount] = useState(0)
  const [weekendWidth, setWeekendWidth] = useState(82) // Default width for weekends

  useEffect(() => {
    const container = containerRef.current
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
  }, [highlightWeekends])

  const getWeeks = useCallback(() => {
    const container = containerRef.current
    return container?.querySelectorAll('.react-datepicker__week')
  }, [])

  useEffect(() => {
    const weeks = getWeeks()
    if (weeks) {
      setWeekCount(weeks.length)
    }
  }, [getWeeks, children])

  return (
    <CalendarContainer className={className}>
      <div ref={containerRef} className={styles.parentContainer}>
        <div
          style={
            highlightWeekends
              ? ({
                  '--weekend-width': `${weekendWidth + 8}px`, // Add a little margin for breather
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
