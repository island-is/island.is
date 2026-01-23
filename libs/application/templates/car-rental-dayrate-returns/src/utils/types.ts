import { DayRateEntry, DayRateEntryModel } from '@island.is/clients-rental-day-rate'

export interface CarCategoryRecord {
  vehicleId: string
  oldMileage: number
  newMilage: number
  rateCategory: string
}

export interface CarCategoryError {
  code: 1 | 2
  message: string
  carNr: string
}

export interface CurrentVehicleWithMilage {
  permno: string | null
  make: string | null
  milage: number | null
}

export interface CarMap {
  [fastnr: string]: DayRateEntry
}
