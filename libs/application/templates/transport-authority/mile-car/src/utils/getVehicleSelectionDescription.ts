import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { CurrentVehiclesAndRecords } from '../shared'
import { selectVehicle as selectVehicleMessages } from '../lib/messages'

export const getVehicleSelectionDescription = (application: Application) => {
  const currentVehicleList = getValueViaPath<CurrentVehiclesAndRecords>(
    application.externalData,
    'currentVehicleList.data',
  )
  if (
    currentVehicleList?.totalRecords &&
    currentVehicleList.totalRecords > 20
  ) {
    return selectVehicleMessages.general.moreThanTwentyVehiclesDescription
  }

  return selectVehicleMessages.general.description
}
