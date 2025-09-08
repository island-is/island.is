import { defineTemplateApi } from '@island.is/application/types'

export {
  IdentityApi,
  UserProfileApi,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
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

export const SocialInsuranceAdministrationEducationLevelsApi =
  defineTemplateApi({
    action: 'getEducationLevelsWithEnum',
    externalDataId: 'socialInsuranceAdministrationEducationLevels',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationCountriesApi = defineTemplateApi({
  action: 'getCountries',
  externalDataId: 'socialInsuranceAdministrationCountries',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationLanguagesApi = defineTemplateApi({
  action: 'getLanguages',
  externalDataId: 'socialInsuranceAdministrationLanguages',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationLatestIncomePlan = defineTemplateApi({
  action: 'getLatestIncomePlan',
  externalDataId: 'socialInsuranceAdministrationLatestIncomePlan',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationSelfAssessmentQuestionsApi =
  defineTemplateApi({
    action: 'getDisabilityPensionSelfAssessmentQuestionnaire',
    externalDataId:
      'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationIncomePlanConditionsApi =
  defineTemplateApi({
    action: 'getIncomePlanConditions',
    externalDataId: 'socialInsuranceAdministrationIncomePlanConditions',
    namespace: 'SocialInsuranceAdministration',
  })
