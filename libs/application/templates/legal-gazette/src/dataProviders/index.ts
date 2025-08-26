import { IdentityApi as IdentityApiProvider } from '@island.is/application/types'
export { UserProfileApi } from '@island.is/application/types'

export const IdentityApi = IdentityApiProvider.configure({
  params: {
    includeActorInfo: true,
  },
})
