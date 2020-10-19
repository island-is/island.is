import React, { FC } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { UserOnboardingModal } from '../../components/UserOnboardingModal/UserOnboardingModal'

export const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  const { data, loading, error } = useUserProfile(userInfo.profile.natreg)

  // If there is no user profile present, graphQL returns an error
  // In which case, we render the onboarding modal
  if (!data && !loading && error)
    return <UserOnboardingModal userInfo={userInfo} />
  // Otherwise we return nothing
  return null
}

export default UserProfile
