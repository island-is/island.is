import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Ministries, emailRegex } from './constants'
import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'

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

export const getWeekdayDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const weekends = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (isWeekday(currentDay)) {
      weekends.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return weekends
}

export const getNextAvailableDate = (date: Date): Date => {
  if (isWeekday(date)) {
    return date
  }
  return getNextAvailableDate(addDays(date, 1))
}

export const isValidEmail = (email: string) => {
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  return parsePhoneNumberFromString(phone, 'IS')?.isValid() ?? false
}

export const mapDepartmentToId = (department: string) => {
  const s = department.toLowerCase()
  switch (s) {
    case 'a-deild':
      return '0'
    case 'b-deild':
      return '1'
    case 'c-deild':
      return '2'
    default:
      return ''
  }
}

// Move this logic to the API when possible?
export const isValidMinsitry = (ministry?: string) =>
  ministry && Ministries.includes(ministry.toLocaleLowerCase())

export const isValidDate = (date?: string) => {
  if (!date) return false
  try {
    return isValid(parse(date, 'yyyy-dd-MM', new Date()))
  } catch (e) {
    return false
  }
}
