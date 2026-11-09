import {
  defineTemplateApi,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  IS_REGULATED_EXTERNAL_DATA_ID,
  QUESTIONS_EXTERNAL_DATA_ID,
} from '../utils/constants'

export { IdentityApi, UserProfileApi }

// Validate that the logged in company/actor has email and phone registered
export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})

// Checks with Fjarskiptastofa whether the company is a supervised entity with an
// open access window. Both flags are stored in externalData: the prerequisites
// screen shows an alert there when the company is ineligible (or when the lookup
// itself failed), and canStartApplication blocks the transition to the draft.
export const SelfAssessmentIsRegulatedApi = defineTemplateApi({
  action: 'getIsRegulated',
  externalDataId: IS_REGULATED_EXTERNAL_DATA_ID,
})

// Fetches the assessment categories and questions from Fjarskiptastofa. The
// applicant sees exactly what the API returns, so new categories or questions
// require no changes here.
export const SelfAssessmentQuestionsApi = defineTemplateApi({
  action: 'getQuestionsAndCategories',
  externalDataId: QUESTIONS_EXTERNAL_DATA_ID,
})
