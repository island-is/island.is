const MILLISECONDS_TO_EXPIRY = 28 * 24 * 60 * 60 * 1000

export const getIndictmentVerdictAppealDeadline = (
  verdictViewDates?: (Date | undefined)[],
): Date | undefined => {
  if (
    !verdictViewDates ||
    verdictViewDates.length === 0 ||
    verdictViewDates.some((date) => !date)
  ) {
    return undefined
  }

  const newestViewDate = verdictViewDates.reduce(
    (newest: Date, current) => (current && current > newest ? current : newest),
    new Date(0),
  )

  return new Date(newestViewDate.getTime() + MILLISECONDS_TO_EXPIRY)
}
