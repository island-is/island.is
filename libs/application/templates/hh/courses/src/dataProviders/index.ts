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

// Gated replacement for the shared HealthCenterApi: the backend only fetches
// the health center for public courses (see CoursesService.getHealthCenter).
// Keeps the `currentHealthcenter` externalDataId so the form is unchanged.
export const HhCoursesHealthCenterApi = defineTemplateApi({
  action: ApiActions.getHealthCenter,
  externalDataId: 'currentHealthcenter',
})

export const HhCoursesParticipantAvailabilityApi = defineTemplateApi({
  action: ApiActions.checkParticipantAvailability,
  externalDataId: 'hhCoursesParticipantAvailability',
})
