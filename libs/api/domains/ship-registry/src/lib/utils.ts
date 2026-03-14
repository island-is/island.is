import parse from 'date-fns/parse'

export const parseDate = (date: string, format = 'dd.MM.yyyy'): Date =>
  parse(date, format, new Date())
