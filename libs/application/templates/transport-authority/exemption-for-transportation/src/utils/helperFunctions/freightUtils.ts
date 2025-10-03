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
import { formatNumber } from './format'

export const getFreightItems = (answers: FormValue): Freight[] => {
  const items =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      answers,
      'freight.items',
    ) || []

  return items.map((item) => ({
    ...item,
    freightId: item.freightId ?? '',
  }))
}

export const getFreightItem = (
  answers: FormValue,
  freightIndex: number,
): Freight | undefined => {
  return getFreightItems(answers)[freightIndex]
}

export const getFreightPairingItemsByIndex = (
  answers: FormValue,
  freightIndex: number,
): (FreightPairing | null)[] => {
  const freightPairing = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(answers, 'freightPairing')

  const items = freightPairing?.[freightIndex]?.items || []
  const convoyIdList = freightPairing?.[freightIndex]?.convoyIdList || []

  return items.map((item) => {
    if (!item?.convoyId || !convoyIdList.includes(item.convoyId)) return null

    return {
      convoyId: item.convoyId,
      length: freightPairing?.[freightIndex]?.length ?? '',
      weight: freightPairing?.[freightIndex]?.weight ?? '',
      height: item.height ?? '',
      width: item.width ?? '',
      totalLength: item.totalLength ?? '',
      exemptionFor:
        item.exemptionFor?.filter((x): x is ExemptionFor => !!x) || [],
    }
  })
}

export const getNonNullFreightPairingItemsByIndex = (
  answers: FormValue,
  freightIndex: number,
): FreightPairing[] => {
  return getFreightPairingItemsByIndex(answers, freightIndex).filter(
    (item): item is FreightPairing => !!item,
  )
}

export const getAllFreightPairingItems = (
  answers: FormValue,
): FreightPairing[] => {
  const freightPairing = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(answers, 'freightPairing')

  return (freightPairing || []).flatMap((_, index) =>
    getNonNullFreightPairingItemsByIndex(answers, index),
  )
}

export const getFreightPairingItem = (
  answers: FormValue,
  freightIndex: number,
  convoyIndex: number,
): FreightPairing | null => {
  const pairingItems = getFreightPairingItemsByIndex(answers, freightIndex)
  return pairingItems[convoyIndex] ?? null
}

export const checkHasFreightPairingItemWithExemptionForWeight = (
  answers: FormValue,
): boolean => {
  const freightPairingAllItems = getAllFreightPairingItems(answers)
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

  return convoyIdList.includes(convoyItem.convoyId)
}

export const getFreightShortTermErrorMessage = (
  externalData: ExternalData,
  answers: FormValue,
  freightIndex: number,
  convoyIndex: number,
): StaticText | undefined => {
  // Police escort error
  const rules = getExemptionRules(externalData)
  const maxLength = rules?.policeEscort.maxLength
  const maxHeight = rules?.policeEscort.maxHeight
  const maxWidth = rules?.policeEscort.maxWidth
  const length = getValueViaPath<string>(
    answers,
    `freightPairing.${freightIndex}.length`,
  )
  const height = getValueViaPath<string>(
    answers,
    `freightPairing.${freightIndex}.items.${convoyIndex}.height`,
  )
  const width = getValueViaPath<string>(
    answers,
    `freightPairing.${freightIndex}.items.${convoyIndex}.width`,
  )
  if (
    (length && maxLength ? Number(length) > maxLength : false) ||
    (height && maxHeight ? Number(height) > maxHeight : false) ||
    (width && maxWidth ? Number(width) > maxWidth : false)
  ) {
    return {
      ...freight.create.warningPoliceEscortAlertMessage,
      values: {
        maxLength: formatNumber(rules?.policeEscort.maxLength),
        maxHeight: formatNumber(rules?.policeEscort.maxHeight),
        maxWidth: formatNumber(rules?.policeEscort.maxWidth),
      },
    }
  }
}

export const getFreightCreateLongTermErrorMessage = (
  _: ExternalData,
  answers: FormValue,
): StaticText | undefined => {
  // Empty list error
  const freightItems = getFreightItems(answers)
  if (!freightItems?.length) return freight.create.errorEmptyListAlertMessage
}

export const getFreightPairingLongTermErrorMessage = (
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

  const rules = getExemptionRules(externalData)
  const maxLength = rules?.policeEscort.maxLength
  const maxHeight = rules?.policeEscort.maxHeight
  const maxWidth = rules?.policeEscort.maxWidth

  // Police escort error (freight)
  const length = getValueViaPath<string>(
    answers,
    `freightPairing.${freightIndex}.length`,
  )
  if (length && maxLength ? Number(length) > maxLength : false) {
    return {
      ...freight.create.errorPoliceEscortAlertMessage,
      values: {
        maxLength,
      },
    }
  }
  // Police escort error (freight-convoy pairing)
  const freightPairingItems = getNonNullFreightPairingItemsByIndex(
    answers,
    freightIndex,
  )
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
