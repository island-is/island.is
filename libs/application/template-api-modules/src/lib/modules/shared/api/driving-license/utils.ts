export const getTodayDateWithMonthDiff = (diff?: number): Date => {
  const today = new Date()
  if (diff) {
    today.setMonth(today.getMonth() + diff)
  }
  return today
}
