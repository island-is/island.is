import ParseDate from 'date-fns/parse'
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

  return formatIfString
    ? ParseDate(date, formatIfString, new Date())
    : ParseISO(date)
}
