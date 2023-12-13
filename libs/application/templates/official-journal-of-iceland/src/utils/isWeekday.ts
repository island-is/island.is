export const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}
