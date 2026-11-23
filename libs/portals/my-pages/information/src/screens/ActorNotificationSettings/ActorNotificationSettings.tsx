import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'

import { ActorNotificationSettings } from '../../components/NotificationSettings/ActorNotificationSettings/ActorNotificationSettings'
import { mNotifications } from '../../lib/messages'

const UserProfile = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()

  return (
    <>
      <IntroWrapper
        marginBottom={2}
        title={formatMessage(m.mySettingsActorNotifications)}
        intro={formatMessage(mNotifications.actorNotificationSettingsIntro)}
        serviceProvider={{
          slug: ISLANDIS_SLUG,
          tooltip: formatMessage(m.userProfileTooltip),
        }}
        desktopContentSpan="10/12"
      />
      <ActorNotificationSettings />
    </>
  )
}

export default UserProfile
