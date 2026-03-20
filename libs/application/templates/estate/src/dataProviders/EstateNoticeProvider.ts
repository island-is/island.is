import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistryV3UserApi,
  UserProfileApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const EstateApi = defineTemplateApi({
  action: 'estateProvider',
  shouldPersistToExternalData: false,
})

export const EstateOnEntryApi = defineTemplateApi({
  action: 'syslumennOnEntry',
  shouldPersistToExternalData: true,
})
