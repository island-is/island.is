import { UserProfile } from '../../types'
import { factory, faker } from '@island.is/shared/mocking'

export const userProfile = factory<UserProfile>({
  nationalId: '1231231234',
  mobilePhoneNumber: '',
  email: '',
  emailVerified: false,
  mobilePhoneNumberVerified: false,
  locale: '',
})
