import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const NationalRegistryV3CohabitantsApi = defineTemplateApi({
  action: 'getCohabitants',
  externalDataId: 'nationalRegistryCohabitants',
  namespace: 'NationalRegistryV3',
})

export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
  })
