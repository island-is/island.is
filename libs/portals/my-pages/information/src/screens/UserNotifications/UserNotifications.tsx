import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'

import { useUserInfo } from '@island.is/react-spa/bff'
import { ActorNotificationSettings } from '../../components/notificationSettings/ActorNotificationSettings/ActorNotificationSettings'
import { NotificationSettings } from '../../components/notificationSettings/NotificationSettings/NotificationSettings'
import { mNotifications } from '../../lib/messages'
import { ActorProfileNotificationSettings } from '../../components/notificationSettings/ActorProfileNotificationSettings/ActorProfileNotificationSettings'

const UserProfile = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const isActor = !!profile?.actor

  return (
    <>
      <IntroWrapper
        marginBottom={[4, 8]}
        title={formatMessage(m.mySettingsNotifications)}
        intro={formatMessage(mNotifications.intro)}
        serviceProviderTooltip={formatMessage(m.userProfileTooltip)}
        serviceProviderSlug={ISLANDIS_SLUG}
      />
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
