import { defineTemplateApi } from '@island.is/application/types'

export { NationalRegistryUserApi } from '@island.is/application/types'

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithDetails',
  externalDataId: 'currentVehicles',
})

export const UserProfileApi = defineTemplateApi({
  action: 'userProfile',
  externalDataId: 'userProfile',
  namespace: 'UserProfile',
  params: {
    validateBankInformation: true,
  },
})
