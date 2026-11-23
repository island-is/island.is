import { DefaultEvents, defineTemplateApi } from '@island.is/application/types'
import {
  ELIGIBILITY_ID,
  PREVIEW_ID,
  SUBMIT_RESULT_ID,
} from '../utils/constants'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

/** Fails, so the applicant can't continue, when there is no history. */
export const EmploymentEligibilityApi = defineTemplateApi({
  action: 'getEmploymentEligibility',
  externalDataId: ELIGIBILITY_ID,
  shouldPersistToExternalData: false,
})

/** Shown on the history screen, never stored in the application. */
export const EmploymentHistoryPreviewApi = defineTemplateApi({
  action: 'getEmploymentHistoryPreview',
  externalDataId: PREVIEW_ID,
  shouldPersistToExternalData: false,
})

/** Doesn't throw, so a failed submit can move to the submission-failed state. */
export const SubmitApplicationApi = defineTemplateApi({
  action: 'submitApplication',
  externalDataId: SUBMIT_RESULT_ID,
  triggerEvent: DefaultEvents.SUBMIT,
  throwOnError: false,
})
