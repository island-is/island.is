import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  StaticText,
} from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { Freight, FreightPairing } from '../types'
import { ExemptionFor } from '../../shared'
import { getConvoyItem, getConvoyShortName } from './getConvoyItem'
import { freight } from '../../lib/messages'
import { getExemptionRules } from './getExemptionRules'

export const getFreightItems = (answers: FormValue): Freight[] => {
  const items =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      answers,
      'freight.items',
    ) || []

  return items
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
  const freightPairingAllItems = getFreightPairingItems(answers)
  return freightPairingAllItems.some((item) =>
    item?.exemptionFor?.includes(ExemptionFor.WEIGHT),
  )
}

export const showFreightPairingItem = (
  answers: FormValue,
  freightIndex: number,
  convoyIndex: number,
): boolean => {
  const convoyItem = getConvoyItem(answers, convoyIndex)
  if (!convoyItem) return false

  const convoyIdList =
    getValueViaPath<string[]>(
      answers,
      `freightPairing.${freightIndex}.convoyIdList`,
    ) || []
  return convoyIdList.indexOf(convoyItem.convoyId) !== -1
}

export const getFreightPairingErrorMessage = (
  externalData: ExternalData,
  answers: FormValue,
  freightIndex: number,
): StaticText | undefined => {
  // Empty list error
  const convoyIdList = getValueViaPath<string[]>(
    answers,
    `freightPairing.${freightIndex}.convoyIdList`,
  )
  const showEmptyListError = !convoyIdList?.length

  // Police escort error
  const freightPairingItems = getFreightPairingItems(answers, freightIndex)
  const rules = getExemptionRules(externalData)
  const maxHeight = rules?.policeEscort.maxHeight
  const maxWidth = rules?.policeEscort.maxWidth
  const invalidConvoyIndex = freightPairingItems
    ? freightPairingItems.findIndex(
        (x) =>
          (x?.height && maxHeight && Number(x.height) > maxHeight) ||
          (x?.width && maxWidth && Number(x.width) > maxWidth),
      )
    : -1
  const convoyItem =
    invalidConvoyIndex !== -1
      ? getConvoyItem(answers, invalidConvoyIndex)
      : undefined
  const showPoliceEscortError = !!convoyItem

  if (showEmptyListError) return freight.pairing.errorEmptyListAlertMessage
  else if (showPoliceEscortError) {
    return {
      ...freight.pairing.errorPoliceEscortAlertMessage,
      values: {
        maxHeight,
        maxWidth,
        convoyNumber: invalidConvoyIndex + 1,
        vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
      },
    }
  }
}
