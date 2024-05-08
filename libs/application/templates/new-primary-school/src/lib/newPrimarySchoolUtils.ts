import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getApplicationAnswers = (answers: Application['answers']) => {
  return {}
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const applicantName = getValueViaPath(
    externalData,
    'identity.data.name',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'identity.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'identity.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'identity.data.address.postalCode',
  ) as string

  const city = getValueViaPath(
    externalData,
    'identity.data.address.city',
  ) as string

  const applicantMunicipality = applicantPostalCode + ' ' + city

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
  }
}
