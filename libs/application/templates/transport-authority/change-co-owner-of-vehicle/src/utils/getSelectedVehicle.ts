import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { CurrentVehiclesAndRecords, VehiclesCurrentVehicle } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
): VehiclesCurrentVehicle => {
  if (answers.findVehicle) {
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
  const requireMileage = getValueViaPath(
    answers,
    'vehicleMileage.requireMileage',
    false,
  ) as boolean
  const mileageReading = getValueViaPath(
    answers,
    'vehicleMileage.mileageReading',
    '',
  ) as string

  const index = parseInt(vehicleIndex, 10)

  if (
    currentVehicleList?.vehicles &&
    currentVehicleList.vehicles[index] &&
    !Object.isFrozen(currentVehicleList.vehicles[index])
  ) {
    currentVehicleList.vehicles[index] = {
      ...currentVehicleList.vehicles[index],
      requireMileage: requireMileage,
      mileageReading: mileageReading,
    }
  }
  return currentVehicleList?.vehicles[parseInt(vehicleIndex, 10)]
}
