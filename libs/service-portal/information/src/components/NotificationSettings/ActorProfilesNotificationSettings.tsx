import React from 'react'
import { useLocale } from '@island.is/localization'
import {
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
import { Problem } from '@island.is/react-spa/shared'

export const ActorProfilesNotificationSettings = () => {
  const { data, loading, error } = useActorProfilesQuery()
  const { formatMessage } = useLocale()

  const getContent = () => {
    if (loading) {
      return <SkeletonLoader borderRadius="large" height={206} />
    }

    if (error) {
      return <Problem error={error} size="small" />
    }

    if (data?.userProfileActorProfiles.data.length === 0) {
      return (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection="row"
          paddingLeft={[2, 4, 4, 10]}
          paddingRight={[2, 4, 4, 12]}
          paddingY={2}
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
            <Box
              className={styles.imageWrap}
              alignItems="center"
              justifyContent="flexEnd"
              display="flex"
            >
              <img src={'./assets/images/company.svg'} alt="" />
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
