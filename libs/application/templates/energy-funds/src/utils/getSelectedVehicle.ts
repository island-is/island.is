import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  CurrentVehiclesAndRecords,
  VehiclesCurrentVehicle,
} from '../shared/types'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  if (
    getValueViaPath<boolean | undefined>(answers, 'selectVehicle.findVehicle')
  ) {
    const vehicle = getValueViaPath(
      answers,
      'selectVehicle',
    ) as VehiclesCurrentVehicle
    return vehicle
  }
  const currentVehicleList =
    (externalData?.currentVehicles?.data as CurrentVehiclesAndRecords) ||
    undefined
  const vehicleValue = getValueViaPath(
    answers,
    'selectVehicle.plate',
    '',
  ) as string
  return currentVehicleList.vehicles.find((x) => x.permno === vehicleValue)
}
