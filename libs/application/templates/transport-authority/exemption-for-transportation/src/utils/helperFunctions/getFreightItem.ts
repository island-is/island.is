import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'

export const getFreightItems = (answers: FormValue) => {
  return (
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      answers,
      'freight.items',
    ) || []
  )
}

export const getFreightItem = (answers: FormValue, index: number) => {
  return getValueViaPath<
    ExemptionForTransportationAnswers['freight']['items'][0]
  >(answers, `freight.items.${index}`)
}

export const getFreightPairingItems = (
  answers: FormValue,
  freightIndex: number,
) => {
  const freightPairing = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(answers, 'freightPairing')

  if (freightPairing && freightPairing[freightIndex])
    return freightPairing[freightIndex]?.items || []
}
