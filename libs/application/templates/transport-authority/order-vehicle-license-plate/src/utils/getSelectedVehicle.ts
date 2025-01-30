import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { VehiclesCurrentVehicle, CurrentVehiclesAndRecords } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
): VehiclesCurrentVehicle | undefined => {
  if (
    getValueViaPath<boolean | undefined>(answers, 'pickVehicle.findVehicle')
  ) {
    const vehicle = getValueViaPath(
      answers,
      'pickVehicle',
    ) as VehiclesCurrentVehicle
    return vehicle
  }
  const currentVehicleList =
    (externalData?.currentVehicleList?.data as CurrentVehiclesAndRecords) ??
    undefined

  const vehicleIndex = getValueViaPath(
    answers,
    'pickVehicle.vehicle',
    '',
  ) as string

  return currentVehicleList?.vehicles?.[parseInt(vehicleIndex, 10)]
}
