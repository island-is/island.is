import { EntryModel } from '@island.is/clients-rental-day-rate'
import { isDayRateEntryActive } from './dayRateUtils'
import { RateCategory } from './constants'
import {
  CarCategoryError,
  CarCategoryRecord,
  CarMap,
  CurrentVehicleWithMilage,
} from './types'
import { parseFileToCarCategory } from './UploadCarCategoryFileUtils'

export type UploadFileType = 'csv' | 'xlsx'

export type ParseUploadResult =
  | { ok: true; records: CarCategoryRecord[] }
  | { ok: false; errors: CarCategoryError[]; reason: 'errors' | 'no-data' }

export const buildCurrentCarMap = (
  vehicles: CurrentVehicleWithMilage[] | undefined,
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
      milage: vehicle.milage ?? 0,
      category: activeDayRate ? RateCategory.DAYRATE : RateCategory.KMRATE,
      activeDayRate,
    }

    return acc
  }, {} as CarMap)
}

export const getManualMileageTableRows = (
  vehicles: CurrentVehicleWithMilage[] | undefined,
  rates: EntryModel[] | undefined,
  rateToChangeTo: RateCategory | undefined,
): Array<{ permno: string; latestMilage: undefined }> => {
  if (!vehicles?.length) return []

  const currentCarMap = buildCurrentCarMap(vehicles, rates)

  return vehicles
    .filter((vehicle) => {
      if (!vehicle.permno) return false

      const currentCar = currentCarMap[vehicle.permno]
      if (!currentCar) return false

      return currentCar.category !== rateToChangeTo
    })
    .map((vehicle) => ({
      permno: vehicle.permno as string,
      latestMilage: undefined,
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
