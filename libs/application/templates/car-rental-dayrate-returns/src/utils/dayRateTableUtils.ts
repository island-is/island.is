import { PaginatedSearchableTableRow } from '@island.is/application/types'
import { DayRateRecord } from './types'

export const getDayRateTableRows = (
  dayRateRecords: DayRateRecord[] | undefined,
): PaginatedSearchableTableRow[] => {
  if (!dayRateRecords?.length) return []

  return dayRateRecords.map((record) => ({
    permno: record.permno,
    prevPeriodTotalDays: record.prevPeriodTotalDays,
    dayRateEntryId: record.dayRateEntryId,
    prevPeriodUsage: undefined,
  }))
}
