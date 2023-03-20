import format from 'date-fns/format'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'

import { dateFormat } from '@island.is/shared/constants'

export const toDate = (seconds: string) => {
  const t = new Date(+seconds)
  return format(t, dateFormat.is)
}

export const formatDate = (date: Date, locale?: Locale) => {
  const t = new Date(date)
  return format(t, dateFormat[locale || 'is'])
}

export const getExpiresIn = (currentDate: Date, date: Date) => {
  const years = differenceInYears(date, currentDate)
  if (years < 1) {
    const months = differenceInMonths(date, currentDate)
    if (months < 1) {
      return {
        key: 'days',
        value: differenceInDays(date, currentDate),
      }
    } else if (months <= 6) {
      return { key: 'months', value: months }
    } else {
      return null
    }
  }
  return null
}

export const isExpired = (currentDate: Date, date: Date) => {
  return !isAfter(date, currentDate)
}
