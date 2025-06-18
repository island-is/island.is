import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { Convoy, Vehicle } from '../types'

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
    convoyItem.vehicle.permno +
    (convoyItem.trailer?.permno ? ' / ' + convoyItem.trailer.permno : '')
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

export const getConvoyVehicle = (
  answers: FormValue,
  vehicleIndex: number,
): Vehicle | undefined => {
  const convoyItems = getConvoyItems(answers)
  const vehicles: Vehicle[] = convoyItems
    .map((x) => x.vehicle)
    .filter((x): x is Vehicle => !!x?.permno)
  const vehiclesSorted = uniqueAndSortByPermno(vehicles)
  return vehiclesSorted?.[vehicleIndex]
}

export const getConvoyTrailer = (
  answers: FormValue,
  trailerIndex: number,
): Vehicle | undefined => {
  const convoyItems = getConvoyItems(answers)
  const trailers: Vehicle[] = convoyItems
    .map((x) => x.trailer)
    .filter((x): x is Vehicle => !!x?.permno)
  const trailersSorted = uniqueAndSortByPermno(trailers)
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
