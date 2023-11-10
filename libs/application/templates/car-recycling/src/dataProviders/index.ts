import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

interface CurrentVehiclesParameters {
  showOwned?: boolean
  showCoOwned?: boolean
  showOperated?: boolean
}

export const CurrentVehiclesApi = defineTemplateApi<CurrentVehiclesParameters>({
  action: 'currentVehicles',
  externalDataId: 'vehiclesList',
  namespace: 'VehiclesShared',
  params: {
    showOwned: true,
    showCoOwned: true,
    showOperated: true,
  },
})
