import { getValueViaPath } from '@island.is/application/core'
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
