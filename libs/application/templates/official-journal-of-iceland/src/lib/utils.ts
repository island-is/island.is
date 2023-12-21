import { ApplicationContext } from '@island.is/application/types'
import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { emailRegex } from './constants'

export function hasApprovedExternalData(context: ApplicationContext): boolean {
  return context.application.answers.approveExternalData === true
}

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekdayDates = (
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
export const isValidEmail = (email: string) => {
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  return parsePhoneNumberFromString(phone, 'IS')?.isValid() ?? false
}
