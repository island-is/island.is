import isSameDay from 'date-fns/isSameDay'

export const isReadDateToday = (d?: Date) => {
  if (!d) {
    return false
  }

  const today = new Date()
  const inputDate = new Date(d)

  return isSameDay(today, inputDate)
}
