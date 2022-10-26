import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
export const CurrentUserTypeProvider = defineTemplateApi({
  action: 'getUserType',
  externalDataId: 'currentUserType',
})
