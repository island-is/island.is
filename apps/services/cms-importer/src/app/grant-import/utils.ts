export const parseGrantDate = (date: Date): { date: string; hour?: number } => {
  const dateHour: number = date.getHours()

  const parsedDate = {
    date: date.toISOString().split('T')[0],
  }

  if (dateHour > 0 && dateHour < 24) {
    return {
      ...parsedDate,
      hour: dateHour,
    }
  }

  if (dateHour === 0) {
    return {
      ...parsedDate,
      hour: 0,
    }
  }

  return parsedDate
}
