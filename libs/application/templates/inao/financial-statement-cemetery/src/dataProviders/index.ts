import { defineTemplateApi } from '@island.is/application/types'
import { UserProfileApi } from '@island.is/application/types'
import { IdentityApi } from '@island.is/application/types'
export { NationalRegistryV3UserApi } from '@island.is/application/types'

export const CurrentUserTypeProvider = defineTemplateApi({
  action: 'getUserType',
  externalDataId: 'currentUserType',
})

export const UserInfoApi = UserProfileApi.configure({
  params: {
    catchMock: true,
  },
})

export const IdentityApiProvider = IdentityApi.configure({
  params: {
    includeActorInfo: true,
  },
})
