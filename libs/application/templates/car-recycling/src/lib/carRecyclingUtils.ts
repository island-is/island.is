import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

import { VehicleMiniDto } from '@island.is/clients/vehicles'

export function getApplicationAnswers(answers: Application['answers']) {
  const vehiclesList = getValueViaPath(
    answers,
    'vehiclesList',
    [],
  ) as VehicleMiniDto[]

  return {
    vehiclesList,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const vehiclesList = getValueViaPath(
    externalData,
    'vehiclesList.data',
    [],
  ) as VehicleMiniDto[]

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    vehiclesList,
  }
}
