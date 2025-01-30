import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { CurrentVehiclesAndRecords, VehiclesCurrentVehicle } from '../shared'

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

  const mileageReading = getValueViaPath(
    answers,
    'vehicleMileage.mileageReading',
    '',
  ) as string

  const index = parseInt(vehicleIndex, 10)

  const vehicle = currentVehicleList?.vehicles?.[index]

  if (vehicle && !Object.isFrozen(vehicle)) {
    currentVehicleList.vehicles[index] = {
      ...vehicle,
      mileageReading: mileageReading,
    }
  }

  return currentVehicleList?.vehicles?.[index]
}
