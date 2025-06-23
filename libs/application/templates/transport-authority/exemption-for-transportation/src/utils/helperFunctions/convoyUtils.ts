import { getValueViaPath } from '@island.is/application/core'
import { FormValue, StaticText } from '@island.is/application/types'
import {
  DollyType,
  ExemptionForTransportationAnswers,
  ExemptionType,
} from '../..'
import { Convoy } from '../types'
import { getExemptionType } from './getExemptionType'
import { convoy } from '../../lib/messages'

export const getConvoyItems = (answers: FormValue): Convoy[] => {
  const items =
    getValueViaPath<ExemptionForTransportationAnswers['convoy']['items']>(
      answers,
      'convoy.items',
    ) || []

  return items.map((item) => ({
    ...item,
    trailer: item.trailer?.permno
      ? {
          permno: item.trailer.permno,
          makeAndColor: item.trailer.makeAndColor || '',
          numberOfAxles: item.trailer.numberOfAxles || 0,
          hasError: item.trailer.hasError || false,
        }
      : undefined,
  }))
}

export const getConvoyItem = (
  answers: FormValue,
  convoyIndex: number,
): Convoy | undefined => {
  return getConvoyItems(answers)[convoyIndex]
}

export const getConvoyShortName = (convoyItem: Convoy): string => {
  return (
    convoyItem?.vehicle?.permno +
    (convoyItem?.trailer?.permno ? ' / ' + convoyItem.trailer.permno : '')
  )
}

export const hasDuplicateConvoyItems = (answers: FormValue): boolean => {
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

export const checkHasConvoyAtIndex = (
  answers: FormValue,
  convoyIndex: number,
): boolean => {
  const convoyItem = getConvoyItem(answers, convoyIndex)
  return !!convoyItem
}

export const checkHasAnyConvoyWithTrailer = (answers: FormValue): boolean => {
  const convoyItems = getConvoyItems(answers)
  return convoyItems.some((item) => item.trailer?.permno)
}

export const checkIsConvoyWithTrailer = (
  answers: FormValue,
  convoyIndex: number,
): boolean => {
  const convoyItem = getConvoyItem(answers, convoyIndex)
  const hasTrailer = !!convoyItem?.trailer?.permno
  return hasTrailer
}

export const checkHasDolly = (answers: FormValue): boolean => {
  return checkHasSingleDolly(answers) || checkHasDoubleDolly(answers)
}

export const checkHasSingleDolly = (answers: FormValue): boolean => {
  const exemptionType = getExemptionType(answers)

  // Note: Since dolly is only allowed in short-term, then there is only one convoy
  const convoyIndexForDolly = 0

  const convoyItem = getConvoyItem(answers, convoyIndexForDolly)
  const hasTrailer = !!convoyItem?.trailer?.permno

  return (
    exemptionType === ExemptionType.SHORT_TERM &&
    hasTrailer &&
    convoyItem?.dollyType === DollyType.SINGLE
  )
}

export const checkHasDoubleDolly = (answers: FormValue): boolean => {
  const exemptionType = getExemptionType(answers)

  // Note: Since dolly is only allowed in short-term, then there is only one convoy
  const convoyIndexForDolly = 0

  const convoyItem = getConvoyItem(answers, convoyIndexForDolly)
  const hasTrailer = !!convoyItem?.trailer?.permno

  return (
    exemptionType === ExemptionType.SHORT_TERM &&
    hasTrailer &&
    convoyItem?.dollyType === DollyType.DOUBLE
  )
}

export const getConvoyLongTermErrorMessage = (
  answers: FormValue,
): StaticText | undefined => {
  // Empty list error
  const convoyItems = getConvoyItems(answers)
  if (!convoyItems?.length) return convoy.error.emptyListErrorMessage

  // Duplicate error
  if (hasDuplicateConvoyItems(answers))
    return convoy.error.duplicateErrorMessage
}
