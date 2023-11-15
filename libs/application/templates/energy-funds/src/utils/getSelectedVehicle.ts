import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  const currentVehicleList =
    (externalData?.currentVehicleList?.data as object[]) || []
  const vehicleValue = getValueViaPath(
    answers,
    'selectVehicle.vehicle',
    '',
  ) as string
  return currentVehicleList[parseInt(vehicleValue, 10)]
}
