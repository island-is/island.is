import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

export const formatDate = (date: string): string => {
  if (!date) {
    return ''
  }
  const parsed = new Date(date)

  return isValid(parsed) ? format(parsed, 'dd.MM.yyyy') : date
}
