import { DayRateEntryModel } from '@island.is/clients-rental-day-rate'
import { MessageDescriptor } from 'react-intl'

export interface CarUsageRecord {
  vehicleId: string
  prevPeriodTotalDays: number
  prevPeriodUsage: number
}

export interface DayRateRecord {
  permno: string
  prevPeriodTotalDays: number
  dayRateEntryId: number
}

export interface CarUsageError {
  code: 1 | 2
  message: MessageDescriptor | string
  carNr: string
}

export interface CurrentVehicleWithMilage {
  permno: string | null
  milage: number | null
}

export interface DayRateEntryMap {
  [permno: string]: Array<DayRateEntryModel>
}
