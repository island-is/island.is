import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  TeachersApi,
} from '@island.is/application/types'

export const CurrentInstructorApi = defineTemplateApi({
  action: 'getCurrentInstructor',
  externalDataId: 'currentInstructor',
})
