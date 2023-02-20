import parseDate from 'date-fns/parse'
import endOfDay from 'date-fns/endOfDay'

const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const transformDate = (val: string) => {
  if (isValidDate(new Date(val))) {
    return val
  }

  return parseDate(val, 'dd.mm.yyyy', endOfDay(new Date()))
}
