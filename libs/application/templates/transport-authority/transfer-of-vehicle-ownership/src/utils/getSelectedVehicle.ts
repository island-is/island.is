import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
): VehiclesCurrentVehicle => {
  const currentVehicleList =
    (externalData?.currentVehicleList?.data as VehiclesCurrentVehicle[]) || []

  const vehicleIndex = getValueViaPath(
    answers,
    'pickVehicle.vehicle',
    '',
  ) as string

  return currentVehicleList[parseInt(vehicleIndex, 10)]
}
