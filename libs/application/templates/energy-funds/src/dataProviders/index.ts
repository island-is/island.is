import { defineTemplateApi } from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: 'nationalRegistry',
  externalDataId: 'individual',
  namespace: 'NationalRegistry',
})

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'currentVehicles',
  externalDataId: 'currentVehicles',
  namespace: 'VehiclesShared',
  params: {
    showOwned: true,
    showCoOwned: true,
  },
})
