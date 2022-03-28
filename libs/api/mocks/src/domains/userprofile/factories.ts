import { factory, faker } from '@island.is/shared/mocking'
import { UserProfile } from '@island.is/api/schema'

export const getUserProfileFactory = factory<UserProfile>({
  nationalId: '000000-0000',
  emailVerified: false,
  mobilePhoneNumberVerified: false,
  documentNotifications: false,
  bankInfo: undefined,
  email: undefined,
  mobilePhoneNumber: undefined,
})
