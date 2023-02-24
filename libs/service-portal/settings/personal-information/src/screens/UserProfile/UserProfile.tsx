import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import ProfileForm from '../../components/Forms/ProfileForm/ProfileForm'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'

const UserProfile = () => {
  const { data } = useUserProfile()
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()

  return (
    <>
      <Text variant="h3" as="h1" marginBottom={2}>
        {formatMessage(m.mySettings)}
      </Text>
      <ProfileForm showDetails={!!data} title={userInfo?.profile?.name || ''} />
    </>
  )
}

export default UserProfile
