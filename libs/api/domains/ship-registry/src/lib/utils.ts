import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'

export const parseDate = (date: string, format = 'dd.MM.yyyy'): Date | null => {
  const parsed = parse(date, format, new Date())
  return isValid(parsed) ? parsed : null
}
