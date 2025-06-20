import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue, StaticText } from '@island.is/application/types'
import {
  DollyType,
  ExemptionForTransportationAnswers,
  ExemptionType,
} from '../..'
import { Convoy, Vehicle } from '../types'
import { getExemptionType } from './getExemptionType'
import { getFreightPairingItems } from './getFreightItem'
import { overview } from '../../lib/messages'

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

const uniqueAndSortByPermno = (items: Vehicle[]): Vehicle[] => {
  const uniqueMap: Record<string, Vehicle> = {}

  for (const item of items) {
    uniqueMap[item.permno] = item // keeps last occurrence
  }

  return Object.values(uniqueMap).sort((a, b) =>
    a.permno.localeCompare(b.permno),
  )
}

export const getAllConvoyVehicles = (answers: FormValue): Vehicle[] => {
  const convoyItems = getConvoyItems(answers)
  const vehicles: Vehicle[] = convoyItems
    .map((x) => x.vehicle)
    .filter((x): x is Vehicle => !!x?.permno)
  const vehiclesSorted = uniqueAndSortByPermno(vehicles)
  return vehiclesSorted
}

export const getConvoyVehicle = (
  answers: FormValue,
  vehicleIndex: number,
): Vehicle | undefined => {
  const vehiclesSorted = getAllConvoyVehicles(answers)
  return vehiclesSorted?.[vehicleIndex]
}

export const getAllConvoyTrailers = (answers: FormValue): Vehicle[] => {
  const convoyItems = getConvoyItems(answers)
  const trailers: Vehicle[] = convoyItems
    .map((x) => x.trailer)
    .filter((x): x is Vehicle => !!x?.permno)
  const trailersSorted = uniqueAndSortByPermno(trailers)
  return trailersSorted
}

export const getConvoyTrailer = (
  answers: FormValue,
  trailerIndex: number,
): Vehicle | undefined => {
  const trailersSorted = getAllConvoyTrailers(answers)
  return trailersSorted?.[trailerIndex]
}

export const shouldUseSameValuesForTrailer = (
  answers: FormValue,
  trailerIndex: number,
): boolean => {
  const axleSpacing = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  return (
    axleSpacing?.trailerList?.[trailerIndex]?.useSameValues?.includes(YES) ||
    false
  )
}

export const hasConvoyItemWithTrailer = (answers: FormValue): boolean => {
  const convoyItems = getConvoyItems(answers)
  return convoyItems.some((item) => item.trailer?.permno)
}

export const checkHasTrailer = (
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

export const getConvoyMissingInPairingErrorMessage = (
  answers: FormValue,
): StaticText | undefined => {
  const convoyItems = getConvoyItems(answers)
  const freightPairingAllItems = getFreightPairingItems(answers)

  for (let idx = 0; idx < convoyItems.length; idx++) {
    const convoyItem = convoyItems[idx]
    const isPaired = freightPairingAllItems.some(
      (x) => x.convoyId === convoyItem.convoyId,
    )
    if (!isPaired) {
      return {
        ...overview.freight.convoyMissingErrorMessage,
        values: {
          convoyNumber: idx + 1,
          vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
        },
      }
    }
  }
}
