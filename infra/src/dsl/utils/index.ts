export const addHoursToDate = (date: Date, hours: number): number => {
  return new Date(date.setHours(date.getHours() + hours)).getTime()
}
