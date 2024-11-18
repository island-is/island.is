import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { PlateOwnership } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
): PlateOwnership | undefined => {
  const currentVehicleList =
    (externalData?.['myPlateOwnershipList']?.data as PlateOwnership[]) || []
  const vehicleValue = getValueViaPath(answers, 'pickPlate.value', '') as string
  return currentVehicleList[parseInt(vehicleValue, 10)]
}
