import {
  NationalRegistryV3Address,
  NationalRegistryV3Person,
} from '@island.is/api/schema'
import { ExcludesFalse } from '@island.is/service-portal/core'

export const formatNameBreaks = (
  user: NationalRegistryV3Person | undefined,
  labels?: { givenName?: string; middleName?: string; lastName?: string },
): string | undefined => {
  if (!user?.name) return undefined

  const { givenName, middleName, lastName } = user.name

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
  address: NationalRegistryV3Address | undefined,
): string | undefined => {
  if (!address?.streetName) {
    return undefined
  }

  return `${address.streetName}, ${address.postalCode} ${address.city}`
}
