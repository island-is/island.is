import { useState } from 'react'

import { useLocale } from '@island.is/localization'

import { UserProfileActorProfile } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { mNotifications } from '../../../lib/messages'
import { useUpdateActorProfileMutation } from '../ActorNotificationSettings/userProfileUpdateActorProfile.generated'
import { SettingsCard } from './SettingsCard/SettingsCard'

interface ActorProfileSettingsCardProps {
  profile: UserProfileActorProfile
}

export const ActorProfileSettingsCard = ({
  profile: initialProfile,
}: ActorProfileSettingsCardProps) => {
  const { formatMessage } = useLocale()
  const [updateActorProfile] = useUpdateActorProfileMutation()
  const [profile, setProfile] = useState(initialProfile)

  const onChange = async (active: boolean) => {
    const oldProfile = { ...profile }
    const newProfile = { ...profile, emailNotifications: active }
    setProfile(newProfile)

    try {
      await updateActorProfile({
        variables: {
          input: {
            fromNationalId: profile.fromNationalId,
            emailNotifications: active,
          },
        },
      })
    } catch {
      setProfile(oldProfile)
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  return (
    <SettingsCard
      title={formatMessage(mNotifications.emailNotifications)}
      subtitle={formatMessage(mNotifications.emailNotificationsDescription)}
      toggleLabel={formatMessage(mNotifications.emailNotificationsAriaLabel)}
      checked={profile.emailNotifications}
      onChange={onChange}
    />
  )
}
