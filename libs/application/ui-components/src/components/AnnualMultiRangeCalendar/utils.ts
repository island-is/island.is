import addDays from 'date-fns/addDays'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import parseISO from 'date-fns/parseISO'

export const formatDateId = (date: Date) => format(date, 'yyyy-MM-dd')

export const shiftDate = (date: string, days: number) =>
  formatDateId(addDays(parseISO(date), days))

/**
 * A selected range of ISO dates. `from` is the first selected day and `to` the
 * last. Ranges are compared as half-open intervals, so a range may start on
 * the day another one ends (e.g. a checkout and a check-in on the same day).
 */
export interface CalendarDateRange {
  from: string
  to: string
}

/** Orders two picked dates into a range. */
export const toRange = (first: string, second: string): CalendarDateRange =>
  first <= second ? { from: first, to: second } : { from: second, to: first }

export const getDatesBetween = (from: string, to: string) => {
  const range = toRange(from, to)

  return eachDayOfInterval({
    start: parseISO(range.from),
    end: parseISO(range.to),
  }).map(formatDateId)
}

/** Whether the date is covered by the range, including both ends. */
export const isDateInRange = (range: CalendarDateRange, date: string) =>
  range.from <= date && date <= range.to

/** Whether the date is inside the range's half-open interval `[from, to)`. */
export const isDateBeforeRangeEnd = (range: CalendarDateRange, date: string) =>
  range.from <= date && date < range.to

const rangesOverlap = (first: CalendarDateRange, second: CalendarDateRange) =>
  first.from < second.to && second.from < first.to

/**
 * Adds a range and merges it with every range it overlaps. Ranges that only
 * touch, where one ends on the day the next starts, are kept apart.
 */
export const addRange = (
  ranges: readonly CalendarDateRange[],
  range: CalendarDateRange,
): CalendarDateRange[] => {
  let merged = range
  const separate: CalendarDateRange[] = []

  for (const existing of ranges) {
    if (rangesOverlap(existing, merged)) {
      merged = {
        from: existing.from < merged.from ? existing.from : merged.from,
        to: existing.to > merged.to ? existing.to : merged.to,
      }
    } else {
      separate.push(existing)
    }
  }

  return sortRanges([...separate, merged])
}

export const sortRanges = (
  ranges: readonly CalendarDateRange[],
): CalendarDateRange[] =>
  [...ranges].sort(
    (first, second) =>
      first.from.localeCompare(second.from) ||
      first.to.localeCompare(second.to),
  )

/**
 * Returns the range a click on the date should remove: the range the date is
 * inside of. A day that is only the end of a range returns `undefined`, so a
 * new range can start on it.
 */
export const findRangeToRemove = (
  ranges: readonly CalendarDateRange[],
  date: string,
) => ranges.find((range) => isDateBeforeRangeEnd(range, date))

export const getDateConnections = (
  date: string,
  isJoined: (first: string, second: string) => boolean,
) => {
  const parsedDate = parseISO(date)
  const previousDate = shiftDate(date, -1)
  const nextDate = shiftDate(date, 1)
  const hasPreviousDate = isJoined(previousDate, date)
  const hasNextDate = isJoined(date, nextDate)
  const continuesFromPreviousMonth =
    hasPreviousDate &&
    parseISO(previousDate).getMonth() !== parsedDate.getMonth()
  const continuesIntoNextMonth =
    hasNextDate && parseISO(nextDate).getMonth() !== parsedDate.getMonth()
  const weekday = (getDay(parsedDate) + 6) % 7

  return {
    connectsLeft: weekday > 0 && hasPreviousDate && !continuesFromPreviousMonth,
    connectsRight: weekday < 6 && hasNextDate && !continuesIntoNextMonth,
    continuesFromPreviousMonth,
    continuesIntoNextMonth,
  }
}
