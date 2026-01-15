import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { Locale } from '@island.is/shared/types'

// Takes in date on format 'yyymmdd' and returns Date object
export const dateParse = (startDate: string) => {
  const year = +startDate.substring(0, 4)
  const month = +startDate.substring(4, 6)
  const day = +startDate.substring(6, 8)
  return new Date(year, month - 1, day)
}

export const isDateAfterToday = (date: Date | string | undefined) => {
  if (!date) {
    return null
  }

  let argDate: Date
  if (typeof date === 'string') {
    const tmpDate = new Date(date)
    if (!isNaN(tmpDate.getTime())) {
      argDate = tmpDate
    } else {
      return null
    }
  } else {
    argDate = date
  }

  return argDate > new Date()
}

// Takes in date string or date, with optional format
export const formatDate = (
  date?: string | Date | null,
  dateFormat?: string,
) => {
  if (!date) return ''
  const arg = date instanceof Date ? date : new Date(date)
  try {
    return format(arg, dateFormat ?? 'dd.MM.yyyy')
  } catch {
    return date instanceof Date ? date.toDateString() : date
  }
}

// Takes in date string
export const formatDateWithTime = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy - HH:mm')
  } catch {
    return date
  }
}

export const getWeekday = (date: string) => {
  try {
    return format(new Date(date), 'iiii')
  } catch {
    return date
  }
}

export const getTime = (date: string) => {
  try {
    return format(new Date(date), 'HH:mm')
  } catch {
    return date
  }
}

export const icelandLocalTime = (date?: string) => {
  const targetTimeZone = 'Atlantic/Reykjavik'

  // Get the current local time
  const theTime = date ? new Date(date) : new Date()

  // Convert local time to a string in the target time zone
  const formattedTime = theTime.toLocaleDateString('is-IS', {
    timeZone: targetTimeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return formattedTime
}

export const displayMonthOrYear = (date: string, l: Locale) => {
  const locale = l === 'is' ? is : undefined
  try {
    if (date.includes('-')) {
      return format(new Date(date), 'MMMM yyyy', { locale })
    }
    return format(new Date(date), 'yyyy', { locale })
  } catch {
    return date
  }
}

export const getDateLocale = (locale: Locale) =>
  locale === 'en' ? 'en-US' : 'is-IS'
