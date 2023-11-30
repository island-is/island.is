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
  let isValidDate: boolean
  if (date instanceof Date) {
    isValidDate = !date.toISOString().includes(placeholderDateSubstring)
  } else {
    isValidDate = !date.includes(placeholderDateSubstring)
  }

  if (!isValidDate) {
    return undefined
  }

  if (date instanceof Date) {
    return date
  }

  return formatIfString
    ? ParseDate(date, formatIfString, new Date())
    : ParseISO(date)
}
