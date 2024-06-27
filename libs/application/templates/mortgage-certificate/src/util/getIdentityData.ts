import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { IdentityData } from '../shared'

export const getIdentityData = (application: Application): IdentityData => {
  const identityData = getValueViaPath(
    application.externalData,
    'identity.data',
  ) as IdentityData
  return {
    nationalId: identityData.nationalId,
    name: identityData.name,
    address: {
      streetAddress: identityData.address.streetAddress,
      city: identityData.address.city,
      postalCode: identityData.address.postalCode,
    },
  }
}
