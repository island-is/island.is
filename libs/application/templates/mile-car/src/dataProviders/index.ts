import { defineTemplateApi } from '@island.is/application/types'

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehicles',
  externalDataId: 'currentVehicleList',
})
