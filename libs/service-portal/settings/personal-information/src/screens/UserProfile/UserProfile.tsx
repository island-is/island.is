import React from 'react'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ProfileForm from '../../components/Forms/ProfileForm/ProfileForm'
import { useUserProfile } from '@island.is/service-portal/graphql'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  const { loading } = useUserProfile()

  return (
    <>
      {loading && <SkeletonLoader width="100%" height={100} />}
      <ProfileForm showDetails title={userInfo?.profile?.name || ''} />
    </>
  )
}

export default UserProfile
