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

export const UrgencyAssessmentsApi = defineTemplateApi({
  action: ApiModuleActions.getUrgencyAssessments,
  externalDataId: 'urgencyAssessments',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const PronounsApi = defineTemplateApi({
  action: ApiModuleActions.getPronouns,
  externalDataId: 'pronouns',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const DisabilityStatusesApi = defineTemplateApi({
  action: ApiModuleActions.getDisabilityStatuses,
  externalDataId: 'disabilityStatuses',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const PostalCodesApi = defineTemplateApi({
  action: ApiModuleActions.getPostalCodes,
  externalDataId: 'postalCodes',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})

export const GuardianNotAwareReasonsApi = defineTemplateApi({
  action: ApiModuleActions.getGuardianNotAwareReasons,
  externalDataId: 'guardianNotAwareReasons',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})
