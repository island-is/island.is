import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export {
  UserProfileApi,
  NationalRegistryV3UserApi as NationalRegistryUserApi,
} from '@island.is/application/types'

export const HhCoursesSelectedChargeItemApi = defineTemplateApi({
  action: 'getSelectedChargeItem',
  externalDataId: 'hhCoursesSelectedChargeItem',
})

// Fetches the user's current health center, but only for public courses.
// For professional courses (námskeið fyrir fagfólk) the backend skips the
// fetch entirely. Uses the same externalDataId as the shared HealthCenterApi
// so the form fields reading `currentHealthcenter` keep working unchanged.
export const HhCoursesHealthCenterApi = defineTemplateApi({
  action: ApiActions.getHealthCenter,
  externalDataId: 'currentHealthcenter',
})

export const HhCoursesParticipantAvailabilityApi = defineTemplateApi({
  action: ApiActions.checkParticipantAvailability,
  externalDataId: 'hhCoursesParticipantAvailability',
})
