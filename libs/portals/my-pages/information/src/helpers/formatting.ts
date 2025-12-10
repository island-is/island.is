import {
  NationalRegistryAddress,
  NationalRegistryName,
} from '@island.is/api/schema'
import { ExcludesFalse } from '@island.is/portals/my-pages/core'

export const formatNameBreaks = (
  user: NationalRegistryName | undefined,
  labels?: { givenName?: string; middleName?: string; lastName?: string },
): string | undefined => {
  if (!user) return undefined

  const { firstName, middleName, lastName } = user

  const first = firstName
    ? `${labels?.givenName || 'Eiginnafn'}: ${firstName}`
    : undefined
  const middle = middleName
    ? `${labels?.middleName || 'Millinafn'}: ${middleName}`
    : undefined
  const last = lastName
    ? `${labels?.lastName || 'Kenninafn'}: ${lastName}`
    : undefined

  const formatted = [first, middle, last]
    .filter(Boolean as unknown as ExcludesFalse)
    .join('\n')

  return formatted
}

export const formatAddress = (
  address?: NationalRegistryAddress | null,
): string | undefined => {
  if (!address) return undefined

  const {
    streetAddress = '',
    city = '',
    postalCode = '',
    apartment = '',
  } = address

  if (streetAddress && (streetAddress === city || (!postalCode && !city))) {
    return streetAddress
  }

  return apartment
    ? `${streetAddress}, ${apartment}, ${postalCode} ${city}`
    : `${streetAddress}, ${postalCode} ${city}`
}
