import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

export const toDate = (seconds: string) => {
  const t = new Date(+seconds)
  return format(t, dateFormat.is)
}

export const getDaysBetween = (currentDate: Date, date: Date) => {
  return (date.getTime() - currentDate.getTime()) / 86400000
}

export const getMonthsBetween = (currentDate: Date, date: Date) => {
  return (
    (date.getTime() - currentDate.getTime()) /
    (86400000 * daysInMonth(date.getMonth(), date.getFullYear()))
  )
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
