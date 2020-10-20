import React, { FC } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { UserOnboardingModal } from '../../components/UserOnboardingModal/UserOnboardingModal'
import { UserProfile as UserProfileType } from '@island.is/api/schema'

interface Props {
  userProfile?: UserProfileType | null
}

export const UserProfile: ServicePortalModuleComponent<Props> = ({
  userInfo,
  userProfile,
}) => {
  console.log('user profile', userProfile)
  return <UserOnboardingModal userInfo={userInfo} />
}

export default UserProfile
