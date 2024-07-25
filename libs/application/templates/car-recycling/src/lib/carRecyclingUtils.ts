import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { VehicleDto } from '../shared/types'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const selectedVehicles = getValueViaPath(
    answers,
    'vehicles.selectedVehicles',
    [],
  ) as VehicleDto[]

  const canceledVehicles = getValueViaPath(
    answers,
    'vehicles.canceledVehicles',
    [],
  ) as VehicleDto[]

  const permnoSearch = getValueViaPath(answers, 'permnoSearch', '') as ''

  return {
    selectedVehicles,
    canceledVehicles,
    permnoSearch,
  }
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

export const filterVehiclesList = (
  vehicle: VehicleDto,
  list: VehicleDto[],
): VehicleDto[] => {
  return list.filter((item) => item.permno !== vehicle.permno)
}
