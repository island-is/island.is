import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { EligibleVehicle } from '../types'

export const getEligibleVehicles = (
  externalData: ExternalData,
): EligibleVehicle[] =>
  getValueViaPath<EligibleVehicle[]>(
    externalData,
    'getEligibleVehicles.data.vehicles',
  ) ?? []

export const getSelectedPermno = (answers: FormValue): string | undefined =>
  getValueViaPath<string>(answers, 'vehicle.permno')

export const getSelectedVehicle = (
  answers: FormValue,
  externalData: ExternalData,
): EligibleVehicle | undefined => {
  const permno = getSelectedPermno(answers)
  return getEligibleVehicles(externalData).find((v) => v.permno === permno)
}

export const getVehicleLabel = (vehicle?: EligibleVehicle): string =>
  [vehicle?.permno, vehicle?.make, vehicle?.color].filter(Boolean).join(' - ')

/** Parses a mileage answer, which is stored as a string by the text field. */
export const parseMileage = (value?: string | number): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const mileage = Number(value)
  return Number.isInteger(mileage) && mileage >= 0 ? mileage : undefined
}

export const getDepartureMileage = (answers: FormValue) =>
  parseMileage(getValueViaPath<string>(answers, 'departure.mileage'))

export const getArrivalMileage = (answers: FormValue) =>
  parseMileage(getValueViaPath<string>(answers, 'arrival.mileage'))

export const getMileageDrivenAbroad = (
  answers: FormValue,
): number | undefined => {
  const departure = getDepartureMileage(answers)
  const arrival = getArrivalMileage(answers)
  if (departure === undefined || arrival === undefined) return undefined
  return arrival - departure
}

export const formatMileage = (mileage?: number): string =>
  mileage === undefined ? '' : `${mileage.toLocaleString('de-DE')} km`

export const toDate = (value?: string): Date | undefined => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const endOfToday = (): Date => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
}

export const isTodayOrEarlier = (value?: string): boolean => {
  const date = toDate(value)
  return !!date && date <= endOfToday()
}
