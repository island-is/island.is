import endOfDay from 'date-fns/endOfDay'
import startOfDay from 'date-fns/startOfDay'

export const getTodayParams = () => {
  const today = new Date()
  const startDate = startOfDay(today)
  const endDate = endOfDay(today)

  return {
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
  }
}
