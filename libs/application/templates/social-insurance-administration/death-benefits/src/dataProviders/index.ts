import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  NationalRegistryV3SpouseApi,
  UserProfileApi,
} from '@island.is/application/types'

export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationChildrenApi = defineTemplateApi({
  action: 'getChildrenWithSameDomicile',
  externalDataId: 'socialInsuranceAdministrationChildren',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationCurrenciesApi = defineTemplateApi({
  action: 'getCurrencies',
  externalDataId: 'socialInsuranceAdministrationCurrencies',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationSpousalInfo = defineTemplateApi({
  action: 'getSpousalInfo',
  externalDataId: 'socialInsuranceAdministrationSpousalInfo',
  namespace: 'SocialInsuranceAdministration',
})
