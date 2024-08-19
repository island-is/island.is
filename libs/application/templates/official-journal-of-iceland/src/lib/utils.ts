import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { z } from 'zod'
import { committeeSignatureSchema, regularSignatureSchema } from './dataSchema'

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

export const getRegularSignature = (
  signatureCount: number,
  memberCount: number,
): z.infer<typeof regularSignatureSchema> =>
  Array.from({ length: signatureCount }).map(() => ({
    institution: '',
    date: '',
    members: Array.from({ length: memberCount }).map(() => getEmptyMember()),
    additionalSignature: '',
    html: '',
  }))

export const getCommitteeSignature = (
  memberCount: number,
): z.infer<typeof committeeSignatureSchema> => ({
  institution: '',
  date: '',
  chairman: getEmptyMember(),
  members: Array.from({ length: memberCount }).map(() => getEmptyMember()),
  additionalSignature: '',
  html: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSignatureDefaultValues = (signature: any, index?: number) => {
  if (signature === undefined) {
    return { institution: '', date: '' }
  }

  const isRegularSignature = regularSignatureSchema.safeParse(signature)

  if (isRegularSignature.success) {
    if (index === undefined) {
      return { institution: '', date: '' }
    }

    const { data } = isRegularSignature

    if (data === undefined) {
      return { institution: '', date: '' }
    }

    return {
      institution: data[index].institution,
      date: data[index].date,
    }
  }

  return { institution: signature.institution, date: signature.date }
}
