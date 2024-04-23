import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { mNotifications } from '../../lib/messages'
import { NotificationSettingsCard } from './cards/NotificationSettingsCard'
import { ActorProfileSettingsCard } from './cards/ActorProfileSettingsCard'
import { useActorProfilesQuery } from './graphql/ActorProfiles.generated'

const ActorProfilesNotificationSettings = () => {
  const { data, loading, error } = useActorProfilesQuery()
  const { formatMessage } = useLocale()

  const getContent = () => {
    if (loading) {
      return <SkeletonLoader borderRadius="large" height={206} />
    }

    if (error) {
      return (
        <AlertMessage
          message={formatMessage(mNotifications.fetchErrorMessage)}
          title={formatMessage(mNotifications.fetchErrorTitle)}
          type="warning"
        />
      )
    }

    return (
      <Stack space={[3, 4]} component="ul">
        {data?.userProfileActorProfiles.data.map((actorProfile) => (
          <NotificationSettingsCard
            title={actorProfile.fromName}
            key={actorProfile.fromNationalId}
          >
            <ActorProfileSettingsCard profile={actorProfile} />
          </NotificationSettingsCard>
        ))}
      </Stack>
    )
  }

  return (
    <Box dataTestId="actor-profile-settings-list">
      <Text variant="h4" as="h2" paddingTop={6} paddingBottom={[2, 3]}>
        {formatMessage(mNotifications.delegations)}
      </Text>
      {getContent()}
    </Box>
  )
}

export default ActorProfilesNotificationSettings
