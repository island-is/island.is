import { Application } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'

export const getProcureName = (application: Application) => {
  return getValueViaPath(
    application,
    'externalData.identity.data.name',
  ) as string
}

export const getProcureNationalId = (application: Application) => {
  return getValueViaPath(
    application,
    'externalData.identity.data.nationalId',
  ) as string
}

export const getProcureAddress = (application: Application) => {
  return getValueViaPath(
    application,
    'externalData.identity.data.address.streetAddress',
  ) as string
}

export const getProcurePostalCode = (application: Application) => {
  return getValueViaPath(
    application,
    'externalData.identity.data.address.postalCode',
  ) as string
}

export const getProcureMunicipality = (application: Application) => {
  return getValueViaPath(
    application,
    'externalData.identity.data.address.city',
  ) as string
}
