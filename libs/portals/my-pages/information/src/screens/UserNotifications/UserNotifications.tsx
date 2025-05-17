import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'

import { ActorProfilesNotificationSettings } from '../../components/NotificationSettings/ActorProfilesNotificationSettings/ActorProfilesNotificationSettings'
import { UserProfileNotificationSettings } from '../../components/NotificationSettings/UserProfileNotificationSettings/UserProfileNotificationSettings'
import { mNotifications } from '../../lib/messages'

const UserProfile = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()

  return (
    <>
      <IntroWrapper
        marginBottom={[4, 8]}
        title={formatMessage(m.mySettingsNotifications)}
        intro={formatMessage(mNotifications.intro)}
        serviceProviderTooltip={formatMessage(m.userProfileTooltip)}
        serviceProviderSlug={ISLANDIS_SLUG}
      />
      <UserProfileNotificationSettings />
      <ActorProfilesNotificationSettings />
    </>
  )
}

export default UserProfile
