import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

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

export const NationalRegistryCohabitantsV3Api = defineTemplateApi({
  action: 'getCohabitants',
  externalDataId: 'nationalRegistryCohabitants',
  namespace: 'NationalRegistryV3',
})
