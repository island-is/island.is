export const isGrantAvailable = (
  dateFrom?: string,
  dateTo?: string,
): boolean | undefined => {
  if (!dateFrom) {
    return false
  }
  const typedDateFrom = new Date(dateFrom)

  //invalid date format
  if (Number.isNaN(typedDateFrom)) {
    return
  }

  const today = new Date()

  //if today is earlier than date from, it's not open
  if (today < typedDateFrom) {
    return false
  }

  //if no date to, it's endless
  if (!dateTo) {
    return true
  }

  const typedDateTo = new Date(dateTo)

  if (Number.isNaN(typedDateFrom)) {
    return
  }

  return today < typedDateTo
}
