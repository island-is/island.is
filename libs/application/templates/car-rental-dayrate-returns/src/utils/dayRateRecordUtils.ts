import { DayRateRecord } from './types'

/**
 * Vehicles Skatturinn already has a return for are kept in the list so the
 * applicant can see them, but nothing can be filed for them. Everything else
 * is what the applicant actually has to report on.
 */
export const isEligibleForReporting = (record: DayRateRecord): boolean =>
  record.alreadyReportedDays === undefined

export const getEligibleDayRateRecords = (
  records: DayRateRecord[] | undefined,
): DayRateRecord[] => {
  return (records ?? []).filter(isEligibleForReporting)
}
