import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { CurrentAddress } from '../shared'

export const getLegalDomicileAddress = (externalData: ExternalData): string => {
  const address = getValueViaPath<CurrentAddress>(
    externalData,
    'identity.data.address',
  )
  if (!address?.streetAddress) {
    return ''
  }
  return [
    address.streetAddress,
    `${address.postalCode ?? ''} ${address.city ?? ''}`.trim(),
  ]
    .filter(Boolean)
    .join(', ')
}
