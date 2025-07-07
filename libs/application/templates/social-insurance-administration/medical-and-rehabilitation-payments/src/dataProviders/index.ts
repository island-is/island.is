import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

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

export const SocialInsuranceAdministrationIncomePlanConditionsApi =
  defineTemplateApi({
    action: 'getIncomePlanConditions',
    externalDataId: 'socialInsuranceAdministrationIncomePlanConditions',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationQuestionnairesApi = defineTemplateApi(
  {
    action: 'getSelfAssessmentQuestionnaire',
    externalDataId: 'socialInsuranceAdministrationQuestionnairesSelfAssessment',
    namespace: 'SocialInsuranceAdministration',
  },
)

export const SocialInsuranceAdministrationEctsUnitsApi = defineTemplateApi({
  action: 'getEctsUnits',
  externalDataId: 'socialInsuranceAdministrationEctsUnits',
  namespace: 'SocialInsuranceAdministration',
})
