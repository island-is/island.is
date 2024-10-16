export const getDateAndTime = (
  date: string,
  hours: string,
  minutes: string,
): Date => {
  const finalDate = new Date(date)
  finalDate.setHours(
    parseInt(hours, 10), // hours
    parseInt(minutes, 10), // minutes
  )
  return finalDate
}
