import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { checkHasDolly } from './convoyUtils'

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
