import {
  ApplicationTypes,
  defineTemplateApi,
  IdentityApi,
} from '@island.is/application/types'
export { NationalRegistryV3UserApi } from '@island.is/application/types'

export const IdentityApiProvider = IdentityApi.configure({
  params: {
    includeActorInfo: true,
  },
})

export const CategoriesApi = defineTemplateApi({
  action: 'getCategories',
  externalDataId: 'categories',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const ProtectiveFactorsApi = defineTemplateApi({
  action: 'getProtectiveFactors',
  externalDataId: 'protectiveFactors',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const UrgencyAssessmentsApi = defineTemplateApi({
  action: 'getUrgencyAssessments',
  externalDataId: 'urgencyAssessments',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})
