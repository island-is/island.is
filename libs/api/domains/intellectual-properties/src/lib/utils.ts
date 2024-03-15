import parseDate from 'date-fns/parse'
import isValid from 'date-fns/isValid'
import isEqual from 'date-fns/isEqual'
import parseISO from 'date-fns/parseISO'
import setMilliseconds from 'date-fns/setMilliseconds'

//Default date for all dates in null design
const FALSY_DATE = new Date('0001-01-01T00:00:00')

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
    const isoDate = parseISO(date)
    if (isValid(isoDate)) {
      return isoDate
    }
    return undefined
    //invalid date and no format string to deal, abort.
  } else {
    const parsedDate = parseDate(date, formatIfString, new Date())
    if (isValid(parsedDate)) {
      return parsedDate
    }
    return undefined
  }
}

export function checkIfDesignValueIsFalsy(
  val: Date | boolean | number | null,
): boolean | undefined {
  if (!val) {
    return true
  }

  if (isValid(val)) {
    //then its a date
    const dateVal = val as Date
    //reset the milliseconds
    return isEqual(setMilliseconds(dateVal, 0), FALSY_DATE)
  }

  if (typeof val == 'number') {
    return val === 0
  }

  if (typeof val === 'boolean') {
    return !val
  }

  return
}
