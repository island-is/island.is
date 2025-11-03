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
