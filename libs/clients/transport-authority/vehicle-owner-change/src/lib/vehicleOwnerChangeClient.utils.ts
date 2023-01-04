// Returns date object with the timestamp 12:00 (UTC timezone)
export const getDateAtNoon = (oldDate: Date): Date => {
  const newDate =
    oldDate instanceof Date && !isNaN(oldDate.getDate()) ? oldDate : new Date()
  return new Date(newDate.toISOString().substring(0, 10) + 'T12:00:00Z')
}
