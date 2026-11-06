import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import getDay from 'date-fns/getDay'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import parseISO from 'date-fns/parseISO'
import {
  Box,
  ErrorMessage,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import * as styles from './AnnualMultiRangeCalendar.css'
import {
  formatDateId,
  getConnectedRange,
  getDateConnections,
  getDatesBetween,
  shiftDate,
} from './utils'

export interface AnnualMultiRangeCalendarLabels {
  title: ReactNode
  description?: ReactNode
  months: readonly ReactNode[]
  weekdays: readonly ReactNode[]
  keyboardInstructions: ReactNode
  formatDayAriaLabel: (date: Date) => string
  formatRangeStartSelected: (date: Date) => ReactNode
  formatRangeSelected: (from: Date, to: Date) => ReactNode
  rangeRemoved: ReactNode
}

export interface AnnualMultiRangeCalendarProps {
  id: string
  year: number
  selectedDates: readonly string[]
  onChange: (dates: string[]) => void
  labels: AnnualMultiRangeCalendarLabels
  error?: string
}

export const AnnualMultiRangeCalendar = ({
  id,
  year,
  selectedDates,
  onChange,
  labels,
  error,
}: AnnualMultiRangeCalendarProps) => {
  const [rangeStart, setRangeStart] = useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [focusedDate, setFocusedDate] = useState(
    selectedDates[0] ?? formatDateId(new Date(year, 0, 1)),
  )
  const [announcement, setAnnouncement] = useState<ReactNode>('')
  const dayRefs = useRef(new Map<string, HTMLButtonElement>())
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const instructionsId = `${id}-instructions`
  const errorId = `${id}-error`

  useEffect(() => {
    if (!focusedDate.startsWith(`${year}-`)) {
      setFocusedDate(
        selectedDates.find((date) => date.startsWith(`${year}-`)) ??
          formatDateId(new Date(year, 0, 1)),
      )
    }
  }, [focusedDate, selectedDates, year])

  useEffect(() => {
    setRangeStart(null)
    setHoveredDate(null)
    setAnnouncement('')
  }, [year])

  const selection = useMemo(() => new Set(selectedDates), [selectedDates])
  const preview = useMemo(
    () =>
      new Set(
        rangeStart && hoveredDate
          ? getDatesBetween(rangeStart, hoveredDate)
          : [],
      ),
    [hoveredDate, rangeStart],
  )

  const updateSelection = (dates: string[]) =>
    onChange([...dates].sort())

  const selectDate = (date: string) => {
    if (rangeStart) {
      const range = getDatesBetween(rangeStart, date)
      updateSelection([...new Set([...selectedDates, ...range])])
      setAnnouncement(
        labels.formatRangeSelected(
          parseISO(range[0]),
          parseISO(range[range.length - 1]),
        ),
      )
      setRangeStart(null)
      setHoveredDate(null)
      return
    }

    if (selection.has(date)) {
      const range = getConnectedRange(date, selectedDates)
      updateSelection(
        selectedDates.filter((selectedDate) => !range.has(selectedDate)),
      )
      setAnnouncement(labels.rangeRemoved)
      return
    }

    setRangeStart(date)
    setHoveredDate(date)
    setAnnouncement(labels.formatRangeStartSelected(parseISO(date)))
  }

  const moveFocus = (date: string, days: number) => {
    const nextDate = shiftDate(date, days)
    if (!nextDate.startsWith(`${year}-`)) {
      return
    }

    setFocusedDate(nextDate)
    dayRefs.current.get(nextDate)?.focus()
  }

  const handleDayKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    date: string,
  ) => {
    const dayOffset = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }[event.key]

    if (dayOffset === undefined) {
      return
    }

    event.preventDefault()
    moveFocus(date, dayOffset)
  }

  const connectDayStyle = (
    baseStyle: string,
    date: string,
    dates: Set<string>,
  ) => {
    const {
      connectsLeft,
      connectsRight,
      continuesFromPreviousMonth,
      continuesIntoNextMonth,
    } = getDateConnections(date, dates)

    return [
      baseStyle,
      connectsLeft && styles.connectedLeft,
      connectsRight && styles.connectedRight,
      continuesFromPreviousMonth && styles.continuesFromPreviousMonth,
      continuesIntoNextMonth && styles.continuesIntoNextMonth,
    ]
      .filter((className): className is string => Boolean(className))
      .join(' ')
  }

  const dayStyle = (date: string) => {
    if (date === rangeStart) {
      return connectDayStyle(styles.selectedDay, date, preview)
    }

    if (selection.has(date)) {
      const isEdge =
        !selection.has(shiftDate(date, -1)) ||
        !selection.has(shiftDate(date, 1))

      return connectDayStyle(
        isEdge ? styles.selectedDay : styles.inRangeDay,
        date,
        selection,
      )
    }

    return preview.has(date)
      ? connectDayStyle(styles.previewDay, date, preview)
      : styles.calendarDay
  }

  return (
    <Box>
      <Box marginBottom={3}>
        <Text id={titleId} variant="h4">
          {labels.title}
        </Text>
        {labels.description && (
          <Text id={descriptionId} variant="small" marginTop={1}>
            {labels.description}
          </Text>
        )}
        <VisuallyHidden id={instructionsId}>
          {labels.keyboardInstructions}
        </VisuallyHidden>
        <VisuallyHidden>
          <span aria-live="polite">{announcement}</span>
        </VisuallyHidden>
      </Box>
      <div
        className={styles.calendarGrid}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={[
          ...(labels.description ? [descriptionId] : []),
          instructionsId,
          ...(error ? [errorId] : []),
        ].join(' ')}
        onMouseLeave={() => setHoveredDate(null)}
      >
        {labels.months.map((monthName, monthIndex) => {
          const firstOfMonth = new Date(year, monthIndex, 1)
          const firstWeekDay = (getDay(firstOfMonth) + 6) % 7
          const numberOfDays = getDaysInMonth(firstOfMonth)
          const monthTitleId = `${id}-month-${year}-${monthIndex}`
          const cells = [
            ...Array.from({ length: firstWeekDay }, () => null),
            ...Array.from({ length: numberOfDays }, (_, index) => index + 1),
          ]

          return (
            <section
              aria-labelledby={monthTitleId}
              className={styles.monthCard}
              key={`${year}-${monthIndex}`}
            >
              <Text
                id={monthTitleId}
                variant="h5"
                textAlign="center"
                className={styles.monthHeader}
              >
                {monthName} {year}
              </Text>
              <div className={styles.weekGrid}>
                {labels.weekdays.map((weekday, weekdayIndex) => (
                  <span
                    aria-hidden
                    className={styles.weekDay}
                    key={weekdayIndex}
                  >
                    {weekday}
                  </span>
                ))}
                {cells.map((day, cellIndex) => {
                  if (day === null) {
                    return (
                      <span
                        aria-hidden
                        key={`empty-${cellIndex}`}
                        className={styles.dayPlaceholder}
                      />
                    )
                  }

                  const date = new Date(year, monthIndex, day)
                  const dateValue = formatDateId(date)

                  return (
                    <button
                      ref={(element) => {
                        if (element) {
                          dayRefs.current.set(dateValue, element)
                        } else {
                          dayRefs.current.delete(dateValue)
                        }
                      }}
                      key={dateValue}
                      type="button"
                      aria-label={labels.formatDayAriaLabel(date)}
                      aria-pressed={
                        selection.has(dateValue) || rangeStart === dateValue
                      }
                      className={dayStyle(dateValue)}
                      onClick={() => selectDate(dateValue)}
                      onFocus={() => {
                        setFocusedDate(dateValue)
                        if (rangeStart) {
                          setHoveredDate(dateValue)
                        }
                      }}
                      onKeyDown={(event) =>
                        handleDayKeyDown(event, dateValue)
                      }
                      onMouseEnter={() =>
                        rangeStart && setHoveredDate(dateValue)
                      }
                      tabIndex={focusedDate === dateValue ? 0 : -1}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
      {error && (
        <div id={errorId}>
          <Box marginTop={2}>
            <ErrorMessage>{error}</ErrorMessage>
          </Box>
        </div>
      )}
    </Box>
  )
}
