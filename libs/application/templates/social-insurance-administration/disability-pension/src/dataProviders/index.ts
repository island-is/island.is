import { defineTemplateApi } from '@island.is/application/types'

export {
  IdentityApi,
  UserProfileApi,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
})

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

export const SocialInsuranceAdministrationMaritalStatusesApi =
  defineTemplateApi({
    action: 'getMaritalStatuses',
    externalDataId: 'socialInsuranceAdministrationMaritalStatuses',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationLanguagesApi = defineTemplateApi({
  action: 'getLanguages',
  externalDataId: 'socialInsuranceAdministrationLanguages',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationEmploymentStatusesApi =
  defineTemplateApi({
    action: 'getEmploymentStatusesWithLocale',
    externalDataId: 'socialInsuranceAdministrationEmploymentStatuses',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationProfessionsApi = defineTemplateApi({
  action: 'getProfessionsInDto',
  externalDataId: 'socialInsuranceAdministrationProfessions',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationProfessionActivitiesApi =
  defineTemplateApi({
    action: 'getProfessionActivitiesInDto',
    externalDataId: 'socialInsuranceAdministrationProfessionActivities',
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

export const SocialInsuranceAdministrationResidenceApi = defineTemplateApi({
  action: 'getResidenceTypes',
  externalDataId: 'socialInsuranceAdministrationResidence',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationIncomePlanConditionsApi =
  defineTemplateApi({
    action: 'getIncomePlanConditions',
    externalDataId: 'socialInsuranceAdministrationIncomePlanConditions',
    namespace: 'SocialInsuranceAdministration',
  })
