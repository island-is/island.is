import { defineTemplateApi } from '@island.is/application/types'

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithMileCar',
  externalDataId: 'currentVehicleList',
})
