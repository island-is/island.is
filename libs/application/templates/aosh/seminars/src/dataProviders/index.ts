import { IdentityApi } from '@island.is/application/types'
export { UserProfileApi } from '@island.is/application/types'

export const IdentityApiWithActor = IdentityApi.configure({
  params: { includeActorInfo: true },
})
