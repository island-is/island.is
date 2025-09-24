import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { checkHasDolly, getConvoyItems } from './convoyUtils'
import { Vehicle } from '../types'

export const getVehicleAxleSpacing = (
  answers: FormValue,
  permno: string,
): number[] => {
  const axleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  const vehicleAxleSpacing = axleSpacingAnswers?.vehicleList.find(
    (x) => x.permno === permno,
  )

  return (vehicleAxleSpacing?.values || []).map(mapStringToNumber)
}

export const getDollyAxleSpacing = (answers: FormValue): number[] => {
  const axleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  return [axleSpacingAnswers?.dolly?.value].map(mapStringToNumber)
}

export const getTrailerAxleSpacing = (
  answers: FormValue,
  permno: string,
): number[] => {
  const axleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  const trailerAxleSpacing = axleSpacingAnswers?.trailerList?.find(
    (x) => x.permno === permno,
  )

  return (
    (trailerAxleSpacing?.useSameValues?.includes(YES)
      ? Array((trailerAxleSpacing?.axleCount ?? 0) - 1).fill(
          trailerAxleSpacing?.singleValue,
        )
      : trailerAxleSpacing?.values) || []
  ).map(mapStringToNumber)
}

export const getConvoyVehicleSpacing = (
  answers: FormValue,
  convoyId: string,
): number[] => {
  const vehicleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['vehicleSpacing']
  >(answers, 'vehicleSpacing')

  const vehicleSpacing = vehicleSpacingAnswers?.convoyList?.find(
    (x) => x.convoyId === convoyId,
  )

  return (
    checkHasDolly(answers)
      ? [
          vehicleSpacing?.vehicleToDollyValue,
          vehicleSpacing?.dollyToTrailerValue,
        ]
      : [vehicleSpacing?.vehicleToTrailerValue]
  ).map(mapStringToNumber)
}

const mapStringToNumber = (strValue: string | undefined): number => {
  const num = Number(strValue)
  return isNaN(num) ? 0 : num
}

const uniqueAndSortByPermno = (items: Vehicle[]): Vehicle[] => {
  const uniqueMap: Record<string, Vehicle> = {}

  for (const item of items) {
    uniqueMap[item.permno] = item // keeps last occurrence
  }

  return Object.values(uniqueMap).sort((a, b) =>
    a.permno.localeCompare(b.permno),
  )
}

export const getAllConvoyVehiclesForSpacing = (
  answers: FormValue,
): Vehicle[] => {
  const convoyItems = getConvoyItems(answers)
  const vehicles: Vehicle[] = convoyItems
    .map((x) => x.vehicle)
    .filter((x): x is Vehicle => !!x?.permno)
  const vehiclesSorted = uniqueAndSortByPermno(vehicles)
  return vehiclesSorted
}

export const getConvoyVehicleForSpacing = (
  answers: FormValue,
  vehicleIndex: number,
): Vehicle | undefined => {
  const vehiclesSorted = getAllConvoyVehiclesForSpacing(answers)
  return vehiclesSorted?.[vehicleIndex]
}

export const getAllConvoyTrailersForSpacing = (
  answers: FormValue,
): Vehicle[] => {
  const convoyItems = getConvoyItems(answers)
  const trailers: Vehicle[] = convoyItems
    .map((x) => x.trailer)
    .filter((x): x is Vehicle => !!x?.permno)
  const trailersSorted = uniqueAndSortByPermno(trailers)
  return trailersSorted
}

export const getConvoyTrailerForSpacing = (
  answers: FormValue,
  trailerIndex: number,
): Vehicle | undefined => {
  const trailersSorted = getAllConvoyTrailersForSpacing(answers)
  return trailersSorted?.[trailerIndex]
}

export const checkHasConvoyVehicleForSpacingAtIndex = (
  answers: FormValue,
  vehicleIndex: number,
): boolean => {
  const vehicle = getConvoyVehicleForSpacing(answers, vehicleIndex)
  const hasVehicle = !!vehicle?.permno
  return hasVehicle
}

export const checkHasConvoyTrailerForSpacingAtIndex = (
  answers: FormValue,
  trailerIndex: number,
): boolean => {
  const trailer = getConvoyTrailerForSpacing(answers, trailerIndex)
  const hasTrailer = !!trailer?.permno
  return hasTrailer
}
