export const getCurrentMonthStartDate = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

// Income can be registered up to the end of the month this many months ahead.
export const MAX_REGISTRATION_MONTHS_AHEAD = 4

export const getMaxRegistrationDate = (): Date => {
  const today = new Date()
  return new Date(
    today.getFullYear(),
    today.getMonth() + MAX_REGISTRATION_MONTHS_AHEAD + 1,
    0,
  )
}

export const isEndBeforeStart = (start?: string, end?: string): boolean => {
  if (!start || !end) return false
  const startTime = Date.parse(start)
  const endTime = Date.parse(end)
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return false
  return endTime < startTime
}

// Drafts are pruned at the end of the day they were created so the
// canEdit/canDelete flags fetched from Galdur never go stale overnight.
export const getEndOfDay = (from: Date): Date =>
  new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
