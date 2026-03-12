import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export {
  UserProfileApi,
  NationalRegistryUserApi,
  HealthCenterApi,
} from '@island.is/application/types'

export const HhCoursesSelectedChargeItemApi = defineTemplateApi({
  action: 'getSelectedChargeItem',
  externalDataId: 'hhCoursesSelectedChargeItem',
})

export const HhCoursesParticipantAvailabilityApi = defineTemplateApi({
  action: ApiActions.checkParticipantAvailability,
  externalDataId: 'hhCoursesParticipantAvailability',
})
