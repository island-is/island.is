import isSameDay from 'date-fns/isSameDay'
import isValid from 'date-fns/isValid'

export const isReadDateToday = (inputDate: Date) => {
  if (!isValid(inputDate)) {
    return false
  }

  const today = new Date()
  return isSameDay(today, inputDate)
}
