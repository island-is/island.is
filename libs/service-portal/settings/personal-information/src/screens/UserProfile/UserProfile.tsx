import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ProfileForm from '../../components/Forms/ProfileForm/ProfileForm'
import { useUserProfile } from '@island.is/service-portal/graphql'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  const { data } = useUserProfile()
  return (
    <ProfileForm showDetails={!!data} title={userInfo?.profile?.name || ''} />
  )
}

export default UserProfile
