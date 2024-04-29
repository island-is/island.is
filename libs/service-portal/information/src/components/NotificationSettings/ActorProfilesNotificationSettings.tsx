import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Hidden,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { mNotifications } from '../../lib/messages'
import { NotificationSettingsCard } from './cards/NotificationSettingsCard'
import { ActorProfileSettingsCard } from './cards/ActorProfileSettingsCard'
import { useActorProfilesQuery } from './graphql/ActorProfiles.generated'
import * as styles from './ActorProfilesNotificationSettings.css'

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

    if (data?.userProfileActorProfiles.data.length === 0) {
      return (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection="row"
          paddingLeft={[2, 4, 4, 10]}
          paddingRight={[2, 4, 4, 5]}
          paddingY={[2]}
          border="standard"
          borderRadius="large"
        >
          <Box flexGrow={1}>
            <Text variant="h4" as="h5" paddingBottom={1}>
              {formatMessage(mNotifications.noDelegationsTitle)}
            </Text>
            <Text>
              {formatMessage(mNotifications.noDelegationsDescriptions)}
            </Text>
          </Box>
          <Hidden below="lg">
            <Box>
              <img
                src={
                  'https://images.ctfassets.net/8k0h54kbe6bj/3owSRG31o0rRjJzn5AHkzg/b679bbb20caa6fbd4720938bac0b2b9b/LE_-_Company_-_S2.svg'
                }
                className={styles.imageWrap}
                alt=""
              />
            </Box>
          </Hidden>
        </Box>
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
