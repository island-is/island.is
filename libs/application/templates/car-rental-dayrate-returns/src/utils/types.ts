import { MessageDescriptor } from 'react-intl'

export interface CarUsageRecord {
  vehicleId: string
  prevPeriodTotalDays: number
  prevPeriodUsage: number
}

export interface DayRateRecord {
  permno: string
  prevPeriodTotalDays: number
  /** Optional: Skatturinn resolves the active entry when it is not supplied. */
  dayRateEntryId?: number
  /**
   * Days already registered with Skatturinn for the period. Set when the return
   * has been filed, in which case the vehicle is listed but cannot be edited.
   */
  alreadyReportedDays?: number
}

export interface CarUsageError {
  code: 1 | 2
  message: MessageDescriptor | string
  /** Raw cell value, so it still matches the file row when it is blank */
  carNr: string
  /** 1-based line in the uploaded file, header included */
  row: number
}
