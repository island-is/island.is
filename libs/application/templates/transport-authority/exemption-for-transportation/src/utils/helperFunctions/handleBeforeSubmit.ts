import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'
import { getValueViaPath } from '@island.is/application/core'

export const checkIfConvoyChanged = (
  oldAnswers: FormValue,
  newAnswers: FormValue,
): boolean => {
  const oldConvoyItems =
    getValueViaPath<ExemptionForTransportationAnswers['convoy']['items']>(
      oldAnswers,
      'convoy.items',
    ) || []
  const newConvoyItems =
    getValueViaPath<ExemptionForTransportationAnswers['convoy']['items']>(
      newAnswers,
      'convoy.items',
    ) || []

  const newIndexMap = new Map(
    newConvoyItems
      .filter((item) => !!item.convoyId)
      .map((item, index) => [item.convoyId, index]),
  )

  for (let i = 0; i < oldConvoyItems.length; i++) {
    const oldItem = oldConvoyItems[i]
    if (!oldItem) continue

    const newIndex = newIndexMap.get(oldItem.convoyId)

    // Item was removed
    if (newIndex === undefined) return true

    // Item changed position
    if (newIndex !== i) return true
  }

  return false
}

export const checkIfFreightChanged = (
  oldAnswers: FormValue,
  newAnswers: FormValue,
): boolean => {
  const oldFreightItems =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      oldAnswers,
      'freight.items',
    ) || []
  const newFreightItems =
    getValueViaPath<ExemptionForTransportationAnswers['freight']['items']>(
      newAnswers,
      'freight.items',
    ) || []

  const newIndexMap = new Map(
    newFreightItems
      .filter((item) => !!item.freightId)
      .map((item, index) => [item.freightId, index]),
  )

  for (let i = 0; i < oldFreightItems.length; i++) {
    const oldItem = oldFreightItems[i]
    if (!oldItem) continue

    const newIndex = newIndexMap.get(oldItem.freightId)

    // Item was removed
    if (newIndex === undefined) return true

    // Item changed position
    if (newIndex !== i) return true
  }

  return false
}

export const getUpdatedFreightPairingList = (
  freightPairingList:
    | ExemptionForTransportationAnswers['freightPairing']
    | undefined,
  freight: ExemptionForTransportationAnswers['freight'],
  convoy: ExemptionForTransportationAnswers['convoy'],
): ExemptionForTransportationAnswers['freightPairing'] | undefined => {
  if (!freightPairingList) return undefined

  const freightPairingMap = new Map(
    freightPairingList
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => [p.freightId, p]),
  )

  return freight.items.map((freightItem) => {
    const freightPairing = freightPairingMap.get(freightItem.freightId ?? '')
    if (!freightPairing) return null

    if (freightPairing.items) {
      const convoyItemMap = new Map(
        freightPairing.items
          .filter((c): c is NonNullable<typeof c> => c !== null)
          .map((c) => [c.convoyId, c]),
      )

      freightPairing.items = convoy.items.map(
        (convoyItem) => convoyItemMap.get(convoyItem.convoyId ?? '') ?? null,
      )
    }

    return freightPairing
  })
}
export const getUpdatedVehicleSpacing = (
  vehicleSpacing:
    | ExemptionForTransportationAnswers['vehicleSpacing']
    | undefined,
  convoy: ExemptionForTransportationAnswers['convoy'],
): ExemptionForTransportationAnswers['vehicleSpacing'] | undefined => {
  if (!vehicleSpacing) return undefined

  const map = new Map(vehicleSpacing.convoyList.map((s) => [s.convoyId, s]))

  vehicleSpacing.convoyList = convoy.items.map(
    (convoyItem) =>
      map.get(convoyItem.convoyId ?? '') ?? {
        convoyId: convoyItem.convoyId ?? '',
        hasTrailer: false,
      },
  )

  return vehicleSpacing
}

export const getUpdatedAxleSpacing = (
  axleSpacing: ExemptionForTransportationAnswers['axleSpacing'] | undefined,
  convoy: ExemptionForTransportationAnswers['convoy'],
): ExemptionForTransportationAnswers['axleSpacing'] | undefined => {
  if (!axleSpacing) return undefined

  const vehiclePermnoSet = new Set(convoy.items.map((c) => c.vehicle.permno))

  const trailerPermnoSet = new Set(
    convoy.items
      .filter((c) => c.trailer?.permno)
      .map((c) => c.trailer?.permno || ''),
  )

  axleSpacing.vehicleList = axleSpacing.vehicleList.filter((v) =>
    vehiclePermnoSet.has(v.permno),
  )

  axleSpacing.trailerList = axleSpacing.trailerList.filter((t) =>
    trailerPermnoSet.has(t.permno),
  )

  return axleSpacing
}
