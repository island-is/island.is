import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistryUserApi,
  UserProfileApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const EstateApi = defineTemplateApi({
  action: 'estateProvider',
  shouldPersistToExternalData: false,
})
