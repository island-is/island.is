import { ISLANDIS_SLUG, IntroHeader, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { mNotifications } from '../../lib/messages'
import { UserProfileNotificationSettings } from '../../components/NotificationSettings/UserProfileNotificationSettings'
import { ActorProfilesNotificationSettings } from '../../components/NotificationSettings/ActorProfilesNotificationSettings'

const UserProfile = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()

  return (
    <>
      <IntroHeader
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
