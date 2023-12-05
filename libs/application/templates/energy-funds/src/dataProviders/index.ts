import { defineTemplateApi } from '@island.is/application/types'

export {
  UserProfileApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithDetails',
  externalDataId: 'currentVehicles',
})
