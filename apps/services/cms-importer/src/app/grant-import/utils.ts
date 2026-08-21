export const parseGrantDate = (date: Date): { date: string; hour?: number } => {
  const dateHour = date.getUTCHours()
  const dateMinutes = date.getUTCMinutes()
  const dateSeconds = date.getUTCSeconds()

  const parsedDate = {
    date: date.toISOString().split('T')[0],
  }

  // Rannis convention: 23:59:59 (strictly after 23:59:00) means
  // "open through end of day" — a day-level deadline, no specific hour.
  if (dateHour === 23 && dateMinutes === 59 && dateSeconds > 0) {
    return parsedDate
  }

  if (dateHour > 0 && dateHour < 24) {
    return {
      ...parsedDate,
      hour: dateHour,
    }
  }

  // Midnight also has no meaningful hour to store — the dropdown only
  // supports 1-23 — so it folds into the same no-hour fallback.
  return parsedDate
}
