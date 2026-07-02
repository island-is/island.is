import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const applicantName = getValueViaPath<string>(
    externalData,
    'identity.data.name',
  )

  const applicantNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.nationalId',
  )

  const applicantAddress = getValueViaPath<string>(
    externalData,
    'identity.data.address.streetAddress',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'identity.data.address.postalCode',
  )

  const applicantCity = getValueViaPath<string>(
    externalData,
    'identity.data.address.city',
  )

  const actorName = getValueViaPath<string>(
    externalData,
    'identity.data.actor.name',
  )

  const actorNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.actor.nationalId',
  )

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    actorName,
    actorNationalId,
  }
}
