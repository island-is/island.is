import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Box } from '@island.is/island-ui/core'
import { NotificationSettingsV2 } from '../../components/NotificationSettings/NotificationSettings/NotificationSettingsV2'

import { useUserInfo } from '@island.is/react-spa/bff'
import { mNotifications } from '../../lib/messages'
import { ActorProfileNotificationSettings } from '../../components/NotificationSettings/ActorProfileNotificationSettings/ActorProfileNotificationSettings'
import { Tabs } from '@island.is/island-ui/core'
import { NotificationTypeSettings } from '@/components/NotificationSettings/NotificationTypeSettings/NotificationTypeSettings'
import { LinkV2 } from '@island.is/island-ui/core'

const UserNotificationsV2 = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const isActor = !!profile?.actor

  return (
    <>
      <IntroWrapper
        marginBottom={2}
        title={formatMessage(m.mySettingsNotificationsV2)}
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
          label="tilkynningar"
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
  )
}

export default UserNotificationsV2
