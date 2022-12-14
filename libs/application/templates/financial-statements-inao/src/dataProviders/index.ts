import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  IdentityApi as IndentityApiProvider,
} from '@island.is/application/types'
export const CurrentUserTypeProvider = defineTemplateApi({
  action: 'getUserType',
  externalDataId: 'currentUserType',
})
