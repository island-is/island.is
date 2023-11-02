import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithOwnerchangeChecks',
  externalDataId: 'currentVehicleList',
})
