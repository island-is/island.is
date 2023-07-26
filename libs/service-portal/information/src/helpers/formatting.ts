import {
  NationalRegistryAddress,
  NationalRegistryName,
} from '@island.is/api/schema'
import { ExcludesFalse } from '@island.is/service-portal/core'

export const formatNameBreaks = (
  names?: NationalRegistryName,
  labels?: { givenName?: string; middleName?: string; lastName?: string },
): string | undefined => {
  if (!names) return undefined

  const { givenName, middleName, lastName } = names

  const first = givenName
    ? `${labels?.givenName || 'Eiginnafn'}: ${givenName}`
    : undefined
  const middle = middleName
    ? `${labels?.middleName || 'Millinafn'}: ${middleName}`
    : undefined
  const last = lastName
    ? `${labels?.lastName || 'Kenninafn'}: ${lastName}`
    : undefined

  const formatted = [first, middle, last]
    .filter((Boolean as unknown) as ExcludesFalse)
    .join('\n')

  return formatted
}

export const formatResidenceString = (
  address: NationalRegistryAddress | undefined,
): string | undefined => {
  if (!address?.streetName) {
    return undefined
  }

  return `${address.streetName}, ${address.postalCode} ${address.city}`
}
