import ParseDate from 'date-fns/parse'

export const parseDate = (date: string) =>
  ParseDate(date, 'dd.MM.yyyy HH:mm:ss', new Date())
