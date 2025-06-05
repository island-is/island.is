import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { Freight, FreightPairing } from '../types'

export const getFreightItems = (answers: FormValue): Freight[] => {
  const items =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      answers,
      'freight.items',
    ) || []

  return items.map((item) => ({
    ...item,
    exemptionFor: item.exemptionFor?.filter((x) => !!x) || [],
  }))
}

export const getFreightItem = (
  answers: FormValue,
  freightIndex: number,
): Freight | undefined => {
  return getFreightItems(answers)[freightIndex]
}

export const getFreightPairingItems = (
  answers: FormValue,
  freightIndex?: number,
): FreightPairing[] => {
  const freightPairing = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(answers, 'freightPairing')

  const items =
    freightIndex !== undefined && freightIndex > -1
      ? freightPairing?.[freightIndex]?.items || []
      : freightPairing?.flatMap((x) => x?.items || []) || []

  return items
    .filter((item): item is FreightPairing => !!item)
    .map((item) => ({
      ...item,
      exemptionFor: item.exemptionFor?.filter((x) => !!x) || [],
    }))
}
