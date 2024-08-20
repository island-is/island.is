export const getIndictmentVerdictAppealDeadline = (
  verdictViewDates?: (string | undefined)[],
): Date | undefined => {
  if (!verdictViewDates || verdictViewDates.length === 0) {
    return undefined
  }
  if (verdictViewDates.some((date) => date === undefined)) {
    return undefined
  }

  const viewDates = verdictViewDates.map((date) => new Date(date as string))

  if (viewDates.length === 0) {
    return undefined
  }

  const newestViewDate = viewDates.reduce(
    (newest, current) => (current > newest ? current : newest),
    new Date(0),
  )

  const expiryDate = new Date(newestViewDate.getTime())
  expiryDate.setDate(newestViewDate.getDate() + 28)

  return expiryDate
}
