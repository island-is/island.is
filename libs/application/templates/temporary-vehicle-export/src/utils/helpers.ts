import { YES, getValueViaPath } from '@island.is/application/core'
import parseISO from 'date-fns/parseISO'
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

/**
 * Whether the applicant uses the latest mileage registered at Samgöngustofa as
 * the departure mileage instead of registering a new one. A saved choice is
 * ignored when the selected vehicle has no registered reading, e.g. after the
 * applicant changed vehicle.
 */
export const usesLatestMileage = (answers: FormValue): boolean =>
  getValueViaPath<string>(answers, 'departure.useLatestMileage') === YES &&
  parseMileage(getValueViaPath<string>(answers, 'departure.latestMileage')) !==
    undefined

export const getDepartureMileage = (answers: FormValue) =>
  parseMileage(
    getValueViaPath<string>(
      answers,
      usesLatestMileage(answers)
        ? 'departure.latestMileage'
        : 'departure.mileage',
    ),
  )

/**
 * The departure date is asked for only when a new mileage is registered. When
 * the latest reading at Samgöngustofa is used, the reading date is the
 * departure date, unless Samgöngustofa returned no date for it.
 */
export const usesLatestMileageDate = (answers: FormValue): boolean =>
  usesLatestMileage(answers) &&
  !!getValueViaPath<string>(answers, 'departure.latestMileageReadDate')

export const getDepartureDate = (answers: FormValue): string | undefined =>
  getValueViaPath<string>(
    answers,
    usesLatestMileageDate(answers)
      ? 'departure.latestMileageReadDate'
      : 'departure.date',
  )

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

/**
 * Date-only answers (yyyy-MM-dd) are read as local calendar dates, not UTC
 * midnight, so they keep their day in every time zone
 */
export const toDate = (value?: string): Date | undefined => {
  if (!value) return undefined
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const endOfToday = (): Date => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
}

export const startOfDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

export const isNotBeforeDaysAgo = (value: string | undefined, days: number) => {
  const date = toDate(value)
  return !!date && date >= startOfDaysAgo(days)
}

export const isTodayOrEarlier = (value?: string): boolean => {
  const date = toDate(value)
  return !!date && date <= endOfToday()
}
