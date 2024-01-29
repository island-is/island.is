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
    vehicle.permno = getValueViaPath(answers, 'findVehicle.plate', '') as string
    return vehicle
  }
  if (
    externalData &&
    externalData.currentVehicleList &&
    externalData.currentVehicleList.data &&
    answers &&
    answers['pickVehicle.vehicle']
  ) {
    const currentVehicleList = externalData.currentVehicleList
      .data as CurrentVehiclesAndRecords

    const vehicleIndex = getValueViaPath(
      answers,
      'pickVehicle.vehicle',
      '',
    ) as string

    return currentVehicleList.vehicles[parseInt(vehicleIndex, 10)]
  }
  return {}
}
