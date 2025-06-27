import { defineTemplateApi } from '@island.is/application/types'

export {
  UserProfileApi,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi
} from '@island.is/application/types'


export const SocialInsuranceAdministrationCategorizedIncomeTypesApi =
  defineTemplateApi({
    action: 'getCategorizedIncomeTypes',
    externalDataId: 'socialInsuranceAdministrationCategorizedIncomeTypes',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationCurrenciesApi = defineTemplateApi({
  action: 'getCurrencies',
  externalDataId: 'socialInsuranceAdministrationCurrencies',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationWithholdingTaxApi = defineTemplateApi(
  {
    action: 'getWithholdingTax',
    externalDataId: 'socialInsuranceAdministrationWithholdingTax',
    namespace: 'SocialInsuranceAdministration',
  },
)

export const SocialInsuranceAdministrationLatestIncomePlan = defineTemplateApi({
  action: 'getLatestIncomePlan',
  externalDataId: 'socialInsuranceAdministrationLatestIncomePlan',
  namespace: 'SocialInsuranceAdministration',
})

/*export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
  })*/

export const SocialInsuranceAdministrationIncomePlanConditionsApi =
  defineTemplateApi({
    action: 'getIncomePlanConditions',
    externalDataId: 'socialInsuranceAdministrationIncomePlanConditions',
    namespace: 'SocialInsuranceAdministration',
  })
