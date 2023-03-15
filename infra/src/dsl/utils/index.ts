export const addHoursToDate = (date: Date, hours: number): number | string => {
  return new Date(date.setHours(date.getHours())).getTime()
}
