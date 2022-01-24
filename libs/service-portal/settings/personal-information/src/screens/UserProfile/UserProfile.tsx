import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ProfileForm from '../../components/Forms/ProfileForm/ProfileForm'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  return <ProfileForm showDetails title={userInfo?.profile?.name || ''} />
}

export default UserProfile
