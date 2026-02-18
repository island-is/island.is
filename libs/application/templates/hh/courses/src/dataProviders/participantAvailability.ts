import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export const HhCoursesParticipantAvailabilityApi = defineTemplateApi({
  action: ApiActions.checkParticipantAvailability,
  externalDataId: 'hhCoursesParticipantAvailability',
})
