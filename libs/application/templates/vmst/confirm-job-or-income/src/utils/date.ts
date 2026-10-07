export const getCurrentMonthStartDate = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

export const getCurrentMonthEndDate = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
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
