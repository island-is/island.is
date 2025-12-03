import { getVacationDaysLimit } from './getVacationDaysLimit'

export const getVacationMaxDate = (): Date => {
  const beforeLimit = getVacationDaysLimit()
  const currentYear = new Date().getFullYear()
  const targetYear = beforeLimit ? currentYear : currentYear + 1
  // Month index 8 = September (0-indexed)
  return new Date(targetYear, 8, 15) // September 15th
}
