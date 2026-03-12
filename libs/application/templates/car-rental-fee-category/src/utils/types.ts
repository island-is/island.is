import { DayRateEntryModel } from '@island.is/clients-rental-day-rate'
import { RateCategory } from './constants'
import { MessageDescriptor } from 'react-intl'

export interface CarCategoryRecord {
  vehicleId: string
  oldMileage: number
  newMilage: number
  rateCategory: string
}

export interface CarCategoryError {
  code: 1 | 2
  message: MessageDescriptor | string
  carNr: string
}

export interface CurrentVehicleWithMilage {
  permno: string | null
  milage: number | null
}

export interface CarMap {
  [permno: string]: {
    milage: number
    category: RateCategory
    activeDayRate?: DayRateEntryModel
  }
}
