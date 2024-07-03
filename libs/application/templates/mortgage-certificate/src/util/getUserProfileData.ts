import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { UserProfileData } from '../shared'

export const getUserProfileData = (
  application: Application,
): UserProfileData => {
  const userProfileData = getValueViaPath(
    application.externalData,
    'userProfile.data',
  ) as UserProfileData

  if (!userProfileData) {
    throw new Error('User profile data is missing from the application')
  }

  return {
    email: userProfileData.email,
    mobilePhoneNumber: userProfileData.mobilePhoneNumber,
  }
}
