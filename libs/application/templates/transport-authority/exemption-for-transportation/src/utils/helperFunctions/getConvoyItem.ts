import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'

export const getConvoyItems = (answers: FormValue) => {
  return (
    getValueViaPath<ExemptionForTransportationAnswers['convoy']['items']>(
      answers,
      'convoy.items',
    ) || []
  )
}

export const getConvoyItem = (answers: FormValue, index: number) => {
  return getValueViaPath<
    ExemptionForTransportationAnswers['convoy']['items'][0]
  >(answers, `convoy.items.${index}`)
}

export const isConvoySelected = (
  answers: FormValue,
  freightIndex: number,
  convoyId: string,
): boolean => {
  const convoyIdList =
    getValueViaPath<string[]>(
      answers,
      `freightPairing.${freightIndex}.convoyIdList`,
    ) || []
  return convoyIdList.indexOf(convoyId) !== -1
}

export const getConvoyShortName = (
  convoyItem: ExemptionForTransportationAnswers['convoy']['items'][0],
) => {
  return (
    convoyItem.vehicle.permno +
    (convoyItem.trailer?.permno ? ' / ' + convoyItem.trailer.permno : '')
  )
}

export const hasDuplicateConvoyItems = (answers: FormValue) => {
  const convoyItems = getConvoyItems(answers)

  const keys: string[] = []
  for (const item of convoyItems) {
    const vehiclePermno = item.vehicle?.permno ?? ''
    const trailerPermno = item.trailer?.permno ?? ''
    const key = `${vehiclePermno}_${trailerPermno}`

    if (keys.includes(key)) {
      return true // Duplicate found
    }

    keys.push(key)
  }

  return false // No duplicates
}

export const shouldUseSameSpacingForTrailer = (
  answers: FormValue,
  convoyIndex: number,
) => {
  const axleSpacing = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  return (
    axleSpacing?.[convoyIndex]?.useSameSpacingForTrailer?.includes(YES) || false
  )
}
