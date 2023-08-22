import ParseDate from 'date-fns/parse'

export const parseDate = (date: string) =>
  ParseDate(date, 'dd.MM.yyyy HH:mm:ss', new Date())

export const isValidDate = (date: string) => date !== '0001-01-01T00:00:00'

export type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T
