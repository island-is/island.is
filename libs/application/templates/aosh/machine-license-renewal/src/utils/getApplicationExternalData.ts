import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { WorkMachineLicenseDto } from '@island.is/clients/seminars-ver'

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

  const workMachineLicense = getValueViaPath<WorkMachineLicenseDto>(
    externalData,
    'workMachineLicense.data',
  )

  const paymentId = getValueViaPath<string>(
    externalData,
    'createCharge.data.id',
  )

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    workMachineLicense,
    paymentId,
  }
}
