import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../shared/types'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  if (answers.findVehicle) {
    const vehicle = getValueViaPath(
      answers,
      'selectVehicle',
    ) as VehiclesCurrentVehicle
    return vehicle
  }
  const currentVehicleList =
    (externalData?.currentVehicles?.data as VehiclesCurrentVehicle[]) || []
  const vehicleValue = getValueViaPath(
    answers,
    'selectVehicle.plate',
    '',
  ) as string
  return currentVehicleList.find((x) => x.permno === vehicleValue)
}
