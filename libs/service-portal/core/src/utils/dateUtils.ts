import format from 'date-fns/format'

// Takes in date on format 'yyymmdd' and returns Date object
export const dateParse = (startDate: string) => {
  const year = +startDate.substring(0, 4)
  const month = +startDate.substring(4, 6)
  const day = +startDate.substring(6, 8)
  return new Date(year, month - 1, day)
}

// Takes in date string or date
export const formatDate = (date: string | Date) => {
  const arg = date instanceof Date ? date : new Date(date)
  try {
    return format(arg, 'dd.MM.yyyy')
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
