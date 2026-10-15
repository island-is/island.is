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

// Income already registered with VMST is locked from the 26th until month end.
export const INCOME_DELETION_LOCK_DAY = 26

export const isIncomeDeletionLocked = (): boolean =>
  new Date().getDate() >= INCOME_DELETION_LOCK_DAY

// Next lock boundary after `from`: the 26th of the same month, or the 1st of
// the next month if the lock period has already started.
export const getNextIncomeLockBoundary = (from: Date): Date =>
  from.getDate() < INCOME_DELETION_LOCK_DAY
    ? new Date(from.getFullYear(), from.getMonth(), INCOME_DELETION_LOCK_DAY)
    : new Date(from.getFullYear(), from.getMonth() + 1, 1)
