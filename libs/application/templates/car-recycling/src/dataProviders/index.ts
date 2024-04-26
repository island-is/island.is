import { defineTemplateApi } from '@island.is/application/types'

export const VehicleSearchApi = defineTemplateApi({
  action: 'getCurrentVehicles',
  externalDataId: 'currentVehicles',
  namespace: 'CarRecycling',
})
