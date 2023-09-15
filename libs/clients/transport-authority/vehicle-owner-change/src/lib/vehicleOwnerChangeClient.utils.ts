// Returns date object with at the selected timestamp
export const getDateAtTimestamp = (oldDate: Date, timestamp: string): Date => {
  const newDate =
    oldDate instanceof Date && !isNaN(oldDate.getDate()) ? oldDate : new Date()
  return new Date(newDate.toISOString().substring(0, 10) + 'T' + timestamp)
}
