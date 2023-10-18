import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Machine } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const currentVehicleList =
    (externalData?.machinesList?.data as object[]) || []
  const vehicleValue = getValueViaPath(
    answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  return currentVehicleList[parseInt(vehicleValue, 10)]
}
 
