import { getHolidays } from 'fridagar'
import { ISODate, toISODate } from '@island.is/regulations'
import startOfDay from 'date-fns/startOfDay'
import addDays from 'date-fns/addDays'
import isBefore from 'date-fns/isBefore'
import { editorMsgs } from '../lib/messages'

import { StringOption as Option } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'

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
  if (d.getHours() > 14 && fastTrack) {
    d = addDays(d, 1)
  }
  // only fastTracked regulations may request today and/or a holiday
  if (!fastTrack) {
    d = getWorkdayMinimumDate(10)
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

// ---------------------------------------------------------------------------

// Show warning if gildistökudagur(effectiveDate) is before útgáfudagur(idealPublishDate).
// Only a warning, it is allowed, rarely used but possible.
export const hasPublishEffectiveWarning = (
  effective?: Date,
  publish?: Date,
  fastTrack?: boolean,
): boolean => {
  if (!publish) {
    return false
  }

  const today = new Date()
  const nextWorkdayToday = getNextWorkday(today)

  if (effective) {
    const nextWorkdayEffective = getNextWorkday(effective)

    // Warning if effective date is before publish date
    if (isBefore(nextWorkdayEffective, publish)) {
      return true
    }

    // Warning if effective date is before next workday and fastTrack is active
    if (fastTrack && isBefore(nextWorkdayEffective, nextWorkdayToday)) {
      return true
    }
  } else {
    // Warning if no effective date is set and fastTrack is active or publish date is after next workday
    if (fastTrack || isBefore(nextWorkdayToday, publish)) {
      return true
    }
  }

  return false
}

export const getDateOverviewWarning = (
  effective?: Date,
  publish?: Date,
  fastTrack?: boolean,
): MessageDescriptor[] => {
  const arr = []

  const startPublishDate = publish ? startOfDay(publish) : undefined
  const startEffectiveDate = effective ? startOfDay(effective) : undefined
  const startToday = startOfDay(new Date())

  // Minimum publish date for fast track regulations +1
  const minimumPublishDateNoFastTrack = startOfDay(getWorkdayMinimumDate(10))
  if (hasPublishEffectiveWarning(effective, publish, fastTrack)) {
    arr.push(editorMsgs.publishEffectiveWarning)
  }

  if (!fastTrack) {
    if (
      startPublishDate &&
      isBefore(startPublishDate, minimumPublishDateNoFastTrack) &&
      !isBefore(startPublishDate, startToday)
    ) {
      arr.push(editorMsgs.publishDateEarlyFast)
    }
  }

  if (startPublishDate && isBefore(startPublishDate, startToday)) {
    arr.push(editorMsgs.publishDateEarly)
  }

  if (startEffectiveDate && isBefore(startEffectiveDate, startToday)) {
    arr.push(editorMsgs.effectiveDateEarly)
  }

  return arr
}
