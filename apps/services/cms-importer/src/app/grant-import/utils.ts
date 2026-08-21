export const parseGrantDate = (date: Date): { date: string; hour?: number } => {
  const dateHour = date.getUTCHours()
  const dateMinutes = date.getUTCMinutes()
  const dateSeconds = date.getUTCSeconds()

  const parsedDate = {
    date: date.toISOString().split('T')[0],
  }

  if (dateHour === 23 && dateMinutes === 59 && dateSeconds > 0) {
    return parsedDate
  }

  if (dateHour > 0 && dateHour < 24) {
    return {
      ...parsedDate,
      hour: dateHour,
    }
  }

  return parsedDate
}
