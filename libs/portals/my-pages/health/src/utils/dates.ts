export const today = new Date()

export const addMonths = (date: Date, months: number) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

export const addYears = (date: Date, years: number) => {
  const newDate = new Date(date)
  newDate.setFullYear(newDate.getFullYear() + years)
  return newDate
}

export const getFirstDayOfPreviousYear = () => {
  const year = new Date().getFullYear() - 1
  return new Date(year, 0, 1)
}

export const getLastDayOfPreviousYear = () => {
  const year = new Date().getFullYear() - 1
  return new Date(year, 11, 31)
}
