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

export const SocialInsuranceAdministrationMARPQuestionnairesApi =
  defineTemplateApi({
    action: 'getMARPSelfAssessmentQuestionnaire',
    externalDataId:
      'socialInsuranceAdministrationMARPQuestionnairesSelfAssessment',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationEctsUnitsApi = defineTemplateApi({
  action: 'getEctsUnits',
  externalDataId: 'socialInsuranceAdministrationEctsUnits',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationEducationLevelsApi =
  defineTemplateApi({
    action: 'getEducationLevels',
    externalDataId: 'socialInsuranceAdministrationEducationLevels',
    namespace: 'SocialInsuranceAdministration',
    order: 4,
  })

export const SocialInsuranceAdministrationMARPApplicationTypeApi =
  defineTemplateApi({
    action: 'getMedicalAndRehabilitationApplicationType',
    externalDataId: 'socialInsuranceAdministrationMARPApplicationType',
    namespace: 'SocialInsuranceAdministration',
    order: 3,
  })
