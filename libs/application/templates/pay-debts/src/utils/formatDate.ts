import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

export const formatDate = (date: string): string => {
  if (!date) {
    return ''
  }
  const parsed = new Date(date)
  // The finance-v3 API declares dueDate/finalDueDate as plain, unformatted
  // strings, so fall back to the raw value rather than crashing on a shape
  // date-fns/JS Date can't parse.
  return isValid(parsed) ? format(parsed, 'dd.MM.yyyy') : date
}
