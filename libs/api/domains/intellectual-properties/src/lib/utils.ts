import ParseDate from 'date-fns/parse'
import IsValid from 'date-fns/isValid'
import ParseISO from 'date-fns/parseISO'

export function parseDateIfValid(
  date: Date | string | undefined | null,
  formatIfString?: string,
): Date | undefined {
  if (!date) {
    return undefined
  }

  const placeholderDateSubstring = '0001-01-01T'
  let isPlaceholderDate: boolean
  if (date instanceof Date) {
    isPlaceholderDate = !date.toISOString().includes(placeholderDateSubstring)
  } else {
    isPlaceholderDate = !date.includes(placeholderDateSubstring)
  }

  if (!isPlaceholderDate) {
    return undefined
  }

  if (date instanceof Date) {
    return date
  }

  if (!formatIfString) {
    const isoDate = ParseISO(date)
    if (IsValid(isoDate)) {
      return isoDate
    }
    return undefined
    //invalid date and no format string to deal, abort.
  } else {
    const parsedDate = ParseDate(date, formatIfString, new Date())
    if (IsValid(parsedDate)) {
      return parsedDate
    }
    return undefined
  }
}
