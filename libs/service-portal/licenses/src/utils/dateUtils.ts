import format from 'date-fns/format'

import { dateFormat } from '@island.is/shared/constants'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

export const toDate = (seconds: string) => {
  const t = new Date(+seconds)
  return format(t, dateFormat.is)
}

export const getDaysBetween = (currentDate: Date, date: Date) => {
  return (date.getTime() - currentDate.getTime()) / MS_PER_DAY
}

export const getMonthsBetween = (currentDate: Date, date: Date) => {
  let months
  months = (date.getFullYear() - currentDate.getFullYear()) * 12
  months -= currentDate.getMonth()
  months += date.getMonth()
  return months <= 0 ? 0 : months
}

export const getYearsBetween = (currentDate: Date, date: Date) => {
  return date.getFullYear() - currentDate.getFullYear()
}

export const getExpiresIn = (currentDate: Date, date: Date) => {
  const years = getYearsBetween(currentDate, date)
  if (years < 1) {
    const months = getMonthsBetween(currentDate, date)
    if (months < 1) {
      return { key: 'days', value: getDaysBetween(currentDate, date) }
    } else if (months <= 6) {
      return { key: 'months', value: months }
    } else {
      return null
    }
  }
  return null
}

export const isExpired = (currentDate: Date, date: Date) => {
  return date.getTime() <= currentDate.getTime()
}
