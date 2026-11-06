import addDays from 'date-fns/addDays'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'

export const formatDateId = (date: Date) => format(date, 'yyyy-MM-dd')

export const getDatesBetween = (from: string, to: string) => {
  const fromDate = parseISO(from)
  const toDate = parseISO(to)
  const interval = isAfter(fromDate, toDate)
    ? { start: toDate, end: fromDate }
    : { start: fromDate, end: toDate }

  return eachDayOfInterval(interval).map(formatDateId)
}

export const shiftDate = (date: string, days: number) =>
  formatDateId(addDays(parseISO(date), days))

export interface CalendarDateRange {
  from: string
  to: string
}

/** Groups selected, consecutive ISO dates into inclusive date ranges. */
export const getDateRanges = (
  dates: readonly string[],
): CalendarDateRange[] => {
  const sortedDates = [...new Set(dates)].sort()
  if (sortedDates.length === 0) {
    return []
  }

  const ranges: CalendarDateRange[] = []
  let from = sortedDates[0]
  let to = sortedDates[0]

  sortedDates.slice(1).forEach((date) => {
    if (shiftDate(to, 1) === date) {
      to = date
      return
    }

    ranges.push({ from, to })
    from = date
    to = date
  })

  ranges.push({ from, to })
  return ranges
}

export const getConnectedRange = (
  date: string,
  selectedDates: readonly string[],
) => {
  const selection = new Set(selectedDates)
  const range = [date]

  for (
    let previous = shiftDate(date, -1);
    selection.has(previous);
    previous = shiftDate(previous, -1)
  ) {
    range.push(previous)
  }

  for (
    let next = shiftDate(date, 1);
    selection.has(next);
    next = shiftDate(next, 1)
  ) {
    range.push(next)
  }

  return new Set(range)
}

export const getDateConnections = (
  date: string,
  dates: Set<string>,
) => {
  const parsedDate = parseISO(date)
  const previousDate = shiftDate(date, -1)
  const nextDate = shiftDate(date, 1)
  const hasPreviousDate = dates.has(previousDate)
  const hasNextDate = dates.has(nextDate)
  const continuesFromPreviousMonth =
    hasPreviousDate &&
    parseISO(previousDate).getMonth() !== parsedDate.getMonth()
  const continuesIntoNextMonth =
    hasNextDate && parseISO(nextDate).getMonth() !== parsedDate.getMonth()
  const weekday = (getDay(parsedDate) + 6) % 7

  return {
    connectsLeft:
      weekday > 0 && hasPreviousDate && !continuesFromPreviousMonth,
    connectsRight:
      weekday < 6 && hasNextDate && !continuesIntoNextMonth,
    continuesFromPreviousMonth,
    continuesIntoNextMonth,
  }
}
