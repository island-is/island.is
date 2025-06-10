import {
  ExemptionFor,
  ExemptionForTransportationAnswers,
} from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import { CargoAssignment } from './types'

export const getFirstName = (fullName: string) => {
  const [firstName] = fullName.split(' ')
  return firstName || ''
}

export const getLastName = (fullName: string) => {
  const parts = fullName.split(' ')
  return parts.length > 1 ? parts.slice(1).join(' ') : ''
}

export const mapEnumByValue = <
  FromEnum extends Record<string, string>,
  ToEnum extends Record<string, string>,
>(
  fromEnum: FromEnum,
  toEnum: ToEnum,
  values: (keyof FromEnum)[],
): ToEnum[keyof ToEnum][] => {
  const valueMap = Object.values(fromEnum).reduce<
    Record<string, ToEnum[keyof ToEnum]>
  >((acc, value) => {
    if (Object.values(toEnum).includes(value as ToEnum[keyof ToEnum])) {
      acc[value] = value as ToEnum[keyof ToEnum]
    }
    return acc
  }, {})

  return values
    .map((key) => valueMap[fromEnum[key]])
    .filter((v): v is ToEnum[keyof ToEnum] => v !== undefined)
}

export const getAllFreightForConvoy = (
  freightPairingAnswers: ExemptionForTransportationAnswers['freightPairing'],
  convoyId: string,
): CargoAssignment[] => {
  if (!freightPairingAnswers) return []

  return freightPairingAnswers.flatMap((pairing) => {
    if (!pairing?.items) return []

    const item = pairing.items.find((x) => x?.convoyId === convoyId)
    if (!item) return []

    const exemptionFor = item.exemptionFor || []
    const filteredExemptionFor: ExemptionFor[] = []
    for (let i = 0; i < exemptionFor.length; i++) {
      const val = exemptionFor[i]
      if (val) filteredExemptionFor.push(val)
    }

    return [
      {
        freightId: pairing.freightId,
        height: item.height,
        width: item.width,
        totalLength: item.totalLength,
        exemptionFor: filteredExemptionFor,
      },
    ]
  })
}

export const mapStringToNumber = (strValue: string | undefined): number => {
  const num = Number(strValue)
  return isNaN(num) ? 0 : num
}
