import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  StaticText,
} from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { Freight, FreightPairing } from '../types'
import { ExemptionFor } from '../../shared'
import { getConvoyItem, getConvoyShortName } from './convoyUtils'
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
  freightIndex: number,
): (FreightPairing | null)[] => {
  const freightPairing = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(answers, 'freightPairing')

  const items = freightPairing?.[freightIndex]?.items || []

  return items.map((item) => {
    if (item?.convoyId)
      return {
        convoyId: item.convoyId,
        height: item.height || '',
        width: item.width || '',
        totalLength: item.totalLength || '',
        exemptionFor:
          item.exemptionFor?.filter((x): x is ExemptionFor => !!x) || [],
      }
    else return null
  })
}

export const getFilteredFreightPairingItems = (
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

export const getFreightPairingItem = (
  answers: FormValue,
  freightIndex: number,
  convoyIndex: number,
): FreightPairing | undefined => {
  const pairingItems = getFilteredFreightPairingItems(answers, freightIndex)
  return pairingItems[convoyIndex]
}

export const checkHasFreightPairingItemWithExemptionForWeight = (
  answers: FormValue,
): boolean => {
  const freightPairingAllItems = getFilteredFreightPairingItems(answers)
  return freightPairingAllItems.some((item) =>
    item?.exemptionFor?.includes(ExemptionFor.WEIGHT),
  )
}

export const getSelectedConvoyIdsInFreightPairing = (
  answers: FormValue,
  freightIndex: number,
): string[] => {
  const convoyIdList =
    getValueViaPath<string[]>(
      answers,
      `freightPairing.${freightIndex}.convoyIdList`,
    ) || []
  return convoyIdList
}

export const checkHasSelectedConvoyInFreightPairing = (
  answers: FormValue,
  freightIndex: number,
  convoyIndex: number,
): boolean => {
  const convoyIdList = getSelectedConvoyIdsInFreightPairing(
    answers,
    freightIndex,
  )

  const convoyItem = getConvoyItem(answers, convoyIndex)
  if (!convoyItem) return false

  return convoyIdList.indexOf(convoyItem.convoyId) !== -1
}

export const getFreightLongTermErrorMessage = (
  externalData: ExternalData,
  answers: FormValue,
): StaticText | undefined => {
  // Empty list error
  const freightItems = getFreightItems(answers)
  if (!freightItems?.length) return freight.create.errorEmptyListAlertMessage

  // Police escort error
  const maxLength = getExemptionRules(externalData)?.policeEscort.maxLength
  const invalidFreightIndex = freightItems.findIndex(
    (x) => x.length && maxLength && Number(x.length) > maxLength,
  )
  if (invalidFreightIndex !== -1)
    return {
      ...freight.create.errorPoliceEscortAlertMessage,
      values: {
        maxLength,
        freightNumber: invalidFreightIndex + 1,
        freightName: freightItems[invalidFreightIndex]?.name,
      },
    }
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
  if (!convoyIdList?.length) return freight.pairing.errorEmptyListAlertMessage

  // Police escort error
  const freightPairingItems = getFilteredFreightPairingItems(
    answers,
    freightIndex,
  )
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
  const invalidConvoyItem =
    invalidConvoyIndex !== -1
      ? getConvoyItem(answers, invalidConvoyIndex)
      : undefined
  if (invalidConvoyItem)
    return {
      ...freight.pairing.errorPoliceEscortAlertMessage,
      values: {
        maxHeight,
        maxWidth,
        convoyNumber: invalidConvoyIndex + 1,
        vehicleAndTrailerPermno: getConvoyShortName(invalidConvoyItem),
      },
    }
}
