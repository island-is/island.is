import { IdentityApi as IdentityApiProvider } from '@island.is/application/types'
import { UserProfileApi as UserProfileApiProvider } from '@island.is/application/types'

export const IdentityApi = IdentityApiProvider

export const UserProfileApi = UserProfileApiProvider.configure({
  params: {
    validatePhoneNumber: true,
    validateEmail: true,
  },
})
