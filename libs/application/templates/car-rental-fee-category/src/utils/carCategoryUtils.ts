import { EntryModel, ValidVehicle } from '@island.is/clients-rental-day-rate'
import { isDayRateEntryActive, is15DaysOrMoreFromDate } from './dayRateUtils'
import { RateCategory } from './constants'
import { CarCategoryError, CarCategoryRecord, CarMap } from './types'
import { parseFileToCarCategory } from './UploadCarCategoryFileUtils'

export type UploadFileType = 'csv' | 'xlsx'

export type ParseUploadResult =
  | { ok: true; records: CarCategoryRecord[] }
  | { ok: false; errors: CarCategoryError[]; reason: 'errors' | 'no-data' }

export const buildCurrentCarMap = (
  vehicles: ValidVehicle[] | undefined,
  rates: EntryModel[] | undefined,
  currentDate: Date = new Date(),
): CarMap => {
  if (!vehicles?.length) return {}

  return vehicles.reduce((acc, vehicle) => {
    if (!vehicle.permno) return acc

    const vehicleEntry = rates?.find((rate) => rate.permno === vehicle.permno)
    const activeDayRate = vehicleEntry?.dayRateEntries?.find((entry) =>
      isDayRateEntryActive(entry, currentDate),
    )

    acc[vehicle.permno] = {
      mileage: vehicle.mileage,
      category: activeDayRate ? RateCategory.DAYRATE : RateCategory.KMRATE,
      activeDayRate,
    }

    return acc
  }, {} as CarMap)
}

/**
 * A vehicle has to sit on the day rate for 15 days before it can be moved back
 * to the kilometre rate. Vehicles inside that window are still listed - hiding
 * them made the overview counts look wrong to applicants - but they are marked
 * as not editable so it is clear why they cannot be changed yet.
 */
const isTooRecentlyOnDayRate = (
  car: CarMap[string],
  rateToChangeTo: RateCategory | undefined,
): boolean => {
  if (rateToChangeTo !== RateCategory.KMRATE) return false

  const validFromDate = car.activeDayRate?.validFrom
  return !!validFromDate && !is15DaysOrMoreFromDate(validFromDate)
}

export const getManualMileageTableRows = (
  carMap: CarMap | undefined,
  rateToChangeTo: RateCategory | undefined,
): Array<{
  permno: string
  latestMilage: undefined
  currentMilage: number | null
  disabled: boolean
}> => {
  if (!carMap) return []

  return Object.entries(carMap)
    .filter(([, car]) => car.category !== rateToChangeTo)
    .map(([permno, car]) => ({
      permno,
      latestMilage: undefined,
      currentMilage: car.mileage,
      disabled: isTooRecentlyOnDayRate(car, rateToChangeTo),
    }))
}

export const getUploadFileType = (
  nameOrMime: string,
): UploadFileType | null => {
  if (!nameOrMime) return null

  const lower = nameOrMime.toLowerCase()
  if (
    lower.endsWith('.csv') ||
    lower.includes('text/csv') ||
    lower.includes('application/csv')
  ) {
    return 'csv'
  }
  if (lower.endsWith('.xlsx') || lower.includes('spreadsheetml')) {
    return 'xlsx'
  }

  return null
}

export const parseUploadFile = async (
  file: ArrayBuffer | ArrayBufferView,
  type: UploadFileType,
  rateToChangeTo: RateCategory,
  currentCarData: CarMap,
): Promise<ParseUploadResult> => {
  const parsed = await parseFileToCarCategory(
    file,
    type,
    rateToChangeTo,
    currentCarData,
  )

  if (parsed.length === 0) {
    return { ok: false, errors: [], reason: 'no-data' }
  }

  if ('code' in parsed[0]) {
    return {
      ok: false,
      errors: parsed as CarCategoryError[],
      reason: 'errors',
    }
  }

  return { ok: true, records: parsed as CarCategoryRecord[] }
}
