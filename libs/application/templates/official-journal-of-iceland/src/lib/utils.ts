import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { z } from 'zod'
import { additionSchema, baseEntitySchema } from './dataSchema'
import { getValueViaPath } from '@island.is/application/core'
import { RequiredInputFieldsNames } from './types'
import { FAST_TRACK_DAYS } from './constants'
import { MessageDescriptor } from 'react-intl'
import { v4 as uuid } from 'uuid'

export const countDaysAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  return Math.floor(diff / (1000 * 3600 * 24))
}

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekendDates = (
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

export const addWeekdays = (date: Date, days: number) => {
  let result = new Date(date)
  while (days > 0) {
    result = addDays(result, 1)
    if (isWeekday(result)) {
      days--
    }
  }
  return result
}

export const getNextAvailableDate = (date: Date): Date => {
  if (isWeekday(date)) {
    return date
  }
  return getNextAvailableDate(addDays(date, 1))
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
  roman = true,
): z.infer<typeof additionSchema>[number] => ({
  id: uuid(),
  title: roman
    ? `${titlePrefix} ${convertNumberToRoman(index)}`
    : `${titlePrefix} ${index}`,
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

  const diff = date.getTime() - now.getTime()
  const diffDays = diff / (1000 * 3600 * 24)
  let fastTrack = false

  if (diffDays <= FAST_TRACK_DAYS) {
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
