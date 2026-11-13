import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, LinkV2, Tabs } from '@island.is/island-ui/core'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'

import { useUserInfo } from '@island.is/react-spa/bff'
import { ActorNotificationSettings } from '../../components/NotificationSettings/ActorNotificationSettings/ActorNotificationSettings'
import { NotificationSettings } from '../../components/NotificationSettings/NotificationSettings/NotificationSettings'
import { mNotifications } from '../../lib/messages'
import { ActorProfileNotificationSettings } from '../../components/NotificationSettings/ActorProfileNotificationSettings/ActorProfileNotificationSettings'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import { Features } from '@island.is/feature-flags'
import { NotificationSettingsV2 } from '../../components/NotificationSettings/NotificationSettings/NotificationSettingsV2'
import { NotificationTypeSettings } from '@/components/NotificationSettings/NotificationTypeSettings/NotificationTypeSettings'

const UserProfile = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const isActor = !!profile?.actor

  const { value: isNotificationsV2PageEnabled } = useFeatureFlag(
    Features.isServicePortalNotificationsV2PageEnabled,
    false,
  )

  return isNotificationsV2PageEnabled ? (
    <>
      <IntroWrapper
        marginBottom={2}
        title={formatMessage(m.mySettingsNotifications)}
        intro={formatMessage(mNotifications.introV2)}
        serviceProvider={{
          slug: ISLANDIS_SLUG,
          tooltip: formatMessage(m.userProfileTooltip),
        }}
        desktopContentSpan="10/12"
      />
      <Box marginBottom={[2, 4]}>
        <LinkV2
          href="/minarsidur/min-gogn/tilkynningar"
          color="blue400"
          underline="normal"
          underlineVisibility="always"
        >
          {formatMessage(mNotifications.notificationsLink)}
        </LinkV2>
      </Box>
      {isActor ? (
        <ActorProfileNotificationSettings />
      ) : (
        <Tabs
          label={formatMessage(m.mySettingsNotifications)}
          selected="notifications-tab-how"
          contentBackground="white"
          size="sm"
          tabs={[
            {
              id: 'notifications-tab-how',
              label: formatMessage(mNotifications.notificationsTabHow),
              content: (
                <Box paddingTop={4}>
                  <NotificationSettingsV2 />
                </Box>
              ),
            },
            {
              id: 'notifications-tab-what',
              label: formatMessage(mNotifications.notificationsTabWhat),
              content: (
                <Box paddingTop={4}>
                  <NotificationTypeSettings />
                </Box>
              ),
            },
          ]}
        />
      )}
    </>
  ) : (
    <>
      <IntroWrapper
        marginBottom={[4, 8]}
        title={formatMessage(m.mySettingsNotifications)}
        intro={formatMessage(mNotifications.intro)}
        serviceProvider={{
          slug: ISLANDIS_SLUG,
          tooltip: formatMessage(m.userProfileTooltip),
        }}
        desktopContentSpan="10/12"
      />
      <div>{JSON.stringify(isNotificationsV2PageEnabled)}</div>
      {isActor ? (
        <ActorProfileNotificationSettings />
      ) : (
        <>
          <NotificationSettings />
          <ActorNotificationSettings />
        </>
      )}
    </>
  )
}

export default UserProfile
