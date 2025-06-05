import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { Freight, FreightPairing } from '../types'
import { ExemptionFor } from '../../shared'
import { checkIfExemptionTypeShortTerm } from './getExemptionType'

export const getFreightItems = (answers: FormValue): Freight[] => {
  const items =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      answers,
      'freight.items',
    ) || []

  return items.map((item) => ({
    ...item,
    exemptionFor:
      item.exemptionFor?.filter((x): x is ExemptionFor => x != null) || [],
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

export const hasFreightItemWithExemptionForWeight = (
  answers: FormValue,
): boolean => {
  const isExemptionTypeShortTerm = checkIfExemptionTypeShortTerm(answers)

  // Short-term - look at freight
  if (isExemptionTypeShortTerm) {
    const freightItems = getFreightItems(answers)
    return freightItems.some((item) =>
      item.exemptionFor?.includes(ExemptionFor.WEIGHT),
    )
  }
  // Long-term - look at freightPairing
  else {
    const freightPairingAllItems = getFreightPairingItems(answers)
    return freightPairingAllItems.some((item) =>
      item?.exemptionFor?.includes(ExemptionFor.WEIGHT),
    )
  }
}
