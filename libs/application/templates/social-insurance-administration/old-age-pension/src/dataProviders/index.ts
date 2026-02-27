import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  NationalRegistryV3SpouseApi,
  UserProfileApi,
} from '@island.is/application/types'

export const NationalRegistryResidenceHistoryApi = defineTemplateApi({
  action: 'getResidenceHistory',
  externalDataId: 'nationalRegistryResidenceHistory',
  namespace: 'NationalRegistryV3',
})

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
    order: 2,
  })

// This needs to run before eligible is called because if applicant isn't vskm at TR
// they register one in this call.
export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
  order: 1,
})

export const SocialInsuranceAdministrationCurrenciesApi = defineTemplateApi({
  action: 'getCurrencies',
  externalDataId: 'socialInsuranceAdministrationCurrencies',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationLatestIncomePlan = defineTemplateApi({
  action: 'getLatestIncomePlan',
  externalDataId: 'socialInsuranceAdministrationLatestIncomePlan',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationCategorizedIncomeTypesApi =
  defineTemplateApi({
    action: 'getCategorizedIncomeTypes',
    externalDataId: 'socialInsuranceAdministrationCategorizedIncomeTypes',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationIncomePlanConditionsApi =
  defineTemplateApi({
    action: 'getIncomePlanConditions',
    externalDataId: 'socialInsuranceAdministrationIncomePlanConditions',
    namespace: 'SocialInsuranceAdministration',
  })
