import { getHolidays } from 'fridagar'
import { ISODate, toISODate } from '@island.is/regulations'
import { startOfDay, addDays } from 'date-fns/esm'

import { StringOption as Option } from '@island.is/island-ui/core'

// ---------------------------------------------------------------------------

type IsHolidayMap = Record<string, true | undefined>
const holidayCache: Record<number, IsHolidayMap | undefined> = {}

const getHolidayMap = (year: number): IsHolidayMap => {
  let yearHolidays = holidayCache[year]
  if (!yearHolidays) {
    const holidayMap: IsHolidayMap = {}
    getHolidays(year).forEach((holiday) => {
      holidayMap[toISODate(holiday.date)] = true
    })
    yearHolidays = holidayCache[year] = holidayMap
  }
  return yearHolidays
}

export const isWorkday = (date: Date): boolean => {
  const wDay = date.getDay()
  if (wDay === 0 || wDay === 6) {
    return false
  }
  const holidays = getHolidayMap(date.getFullYear())
  return holidays[toISODate(date)] !== true
}

export const getMinPublishDate = (fastTrack: boolean, signatureDate?: Date) => {
  let d = new Date()
  // Shift forward one day if the time is 14:00 or later.
  if (d.getHours() > 14) {
    d = addDays(d, 1)
  }
  // only fastTracked regulations may request today and/or a holiday
  if (!fastTrack) {
    d = getNextWorkday(addDays(d, 1))
  }
  const minDate = startOfDay(d)

  // Signature date sets a hard lower boundry on publication date.
  if (signatureDate && signatureDate > minDate) {
    return signatureDate
  }
  return minDate
}

export const getNextWorkday = (date: Date) => {
  // Returns the next workday.
  let nextDay = date
  while (!isWorkday(nextDay)) {
    nextDay = addDays(nextDay, 1)
  }
  return nextDay
}

// ---------------------------------------------------------------------------

/**
 * Get the next workday with a minimum number.
 * @param num number of working days
 * @returns Date {num} working days from now
 */
export const getWorkdayMinimumDate = (num: number) => {
  let d = new Date()
  let dateNum = 0

  while (num > dateNum) {
    if (isWorkday(d)) {
      dateNum++
    }
    d = addDays(d, 1)
  }

  d = getNextWorkday(d)

  return d
}

// ---------------------------------------------------------------------------

export const workingDaysUntil = (date: Date | ISODate) => {
  const targetDate = date instanceof Date ? startOfDay(date) : new Date(date)
  const refDate = startOfDay(Date.now())
  if (targetDate <= refDate) {
    return { workingDayCount: 0, today: true }
  }

  let workingDayCount = 0
  while (refDate < targetDate) {
    if (isWorkday(refDate)) {
      workingDayCount += 1
    }
    refDate.setDate(refDate.getDate() + 1)
  }
  return { workingDayCount, today: false }
}

// ---------------------------------------------------------------------------

export const emptyOption = (label?: string, disabled?: boolean): Option => ({
  value: '',
  label: label ? `– ${label} –` : '—',
  disabled,
})
