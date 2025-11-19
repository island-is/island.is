import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import startOfDay from 'date-fns/startOfDay'
import { z } from 'zod'
import { additionSchema, baseEntitySchema } from './dataSchema'
import { getValueViaPath } from '@island.is/application/core'
import { RequiredInputFieldsNames } from './types'
import { FAST_TRACK_DAYS, MINIMUM_WEEKDAYS } from './constants'
import { MessageDescriptor } from 'react-intl'
import { v4 as uuid } from 'uuid'
import { getHolidays, Holiday } from 'fridagar'
import { toISODate } from '@island.is/regulations'

export const countDaysAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  return Math.floor(diff / (1000 * 3600 * 24))
}

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

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

const isWorkday = (date: Date): boolean => {
  const wDay = date.getDay()
  if (wDay === 0 || wDay === 6) {
    return false
  }
  const holidays = getHolidayMap(date.getFullYear())
  return holidays[toISODate(date)] !== true
}
const getNextWorkday = (date: Date) => {
  // Returns the next workday.
  let nextDay = date
  let iterations = 0
  const MAX_ITERATIONS = 30 // Prevent infinite loop
  while (!isWorkday(nextDay) && iterations < MAX_ITERATIONS) {
    nextDay = addDays(nextDay, 1)
    iterations++
  }
  return nextDay
}

export const isDateNotBeforeToday = (dateStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // start of the day
  const date = new Date(dateStr)
  return date >= today
}

const addWorkDays = (date: Date, days: number) => {
  let result = new Date(date)
  while (days > 0) {
    result = addDays(result, 1)
    if (isWorkday(result)) {
      days--
    }
  }
  return result
}

const getWeekendDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const weekdays = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (!isWeekday(currentDay)) {
      weekdays.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return weekdays
}

const getDateString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Get default date, but push it to the next workday if it is a weekend or holiday
export const getDefaultDate = (requestedDate?: string) => {
  if (!requestedDate) {
    const date = getNextWorkday(addWorkDays(new Date(), MINIMUM_WEEKDAYS))
    return getDateString(date)
  }
  const date = new Date(requestedDate)
  return getDateString(getNextWorkday(date))
}

export const getExcludedDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const currentYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  let holidays: Holiday[] = []
  for (let year = currentYear; year <= endYear; year++) {
    holidays = [...holidays, ...getHolidays(year)]
  }
  const weekendDates = getWeekendDates(startDate, endDate)

  return [
    ...new Set([...weekendDates, ...holidays.map((holiday) => holiday.date)]),
  ]
}

export const getEmptyMember = () => ({
  name: '',
  above: '',
  after: '',
  before: '',
  below: '',
})

export enum TitlePrefix {
  Appendix = 'Viðauki',
  Attachment = 'Fylgiskjal',
}

export const getAddition = (
  titlePrefix: TitlePrefix,
  index: number,
): z.infer<typeof additionSchema>[number] => ({
  id: uuid(),
  title: `${titlePrefix} ${index}`,
  content: '',
  type: 'html',
})

export const isBaseEntity = (
  entity: unknown,
): entity is z.infer<typeof baseEntitySchema> =>
  baseEntitySchema.safeParse(entity).success

export const isAddition = (
  addition: unknown,
): addition is z.infer<typeof additionSchema> =>
  additionSchema.safeParse(addition).success

export const parseZodIssue = (issue: z.ZodCustomIssue) => {
  const path = issue.path.join('.')
  return {
    name: getValueViaPath(RequiredInputFieldsNames, path) as string,
    message: issue?.params as MessageDescriptor,
  }
}

export const getFastTrack = (date?: Date) => {
  const now = new Date()
  if (!date)
    return {
      fastTrack: false,
      now,
    }

  const fastTrackCutoffDate = startOfDay(
    getNextWorkday(addWorkDays(new Date(), FAST_TRACK_DAYS)),
  )

  const compareDate = startOfDay(date)

  let fastTrack = false

  if (fastTrackCutoffDate.getTime() > compareDate.getTime()) {
    fastTrack = true
  }
  return {
    fastTrack,
    now,
  }
}

export const base64ToBlob = (base64: string, mimeType = 'application/pdf') => {
  if (!base64) {
    return null
  }

  const byteCharacters = Buffer.from(base64, 'base64')
  return new Blob([byteCharacters], { type: mimeType })
}

export const convertNumberToRoman = (num: number) => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  return roman[num - 1]
}

export const cleanTypename = (obj: {
  __typename?: string
  id: string
  title: string
  slug: string
}) => {
  const { __typename: _, ...rest } = obj
  return rest
}

export const capitalizeText = (text?: string | null): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
