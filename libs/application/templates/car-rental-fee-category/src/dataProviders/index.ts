import { defineTemplateApi } from '@island.is/application/types'

export const VehiclesApi = defineTemplateApi({
  action: 'getCurrentVehicles',
})

export const SkatturApi = defineTemplateApi({
  action: 'getCurrentVehiclesRateCategory',
})
