import {
  ApplicationTypes,
  defineTemplateApi,
  IdentityApi,
} from '@island.is/application/types'
import { ApiModuleActions } from '../utils/constants'
export { NationalRegistryV3UserApi } from '@island.is/application/types'

export const IdentityApiProvider = IdentityApi.configure({
  params: {
    includeActorInfo: true,
  },
})

export const CategoriesApi = defineTemplateApi({
  action: ApiModuleActions.getCategories,
  externalDataId: 'categories',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const ProtectiveFactorsApi = defineTemplateApi({
  action: ApiModuleActions.getProtectiveFactors,
  externalDataId: 'protectiveFactors',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const GendersApi = defineTemplateApi({
  action: ApiModuleActions.getGenders,
  externalDataId: 'genders',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const ChildInformationApi = defineTemplateApi({
  action: ApiModuleActions.getChildInformation,
  externalDataId: 'childInformation',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})
