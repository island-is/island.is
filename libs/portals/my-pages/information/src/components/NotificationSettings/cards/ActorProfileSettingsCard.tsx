import { useState } from 'react'

import { useLocale } from '@island.is/localization'

import { UserProfileActorProfile } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { mNotifications } from '../../../lib/messages'
import { SettingsCard } from './SettingsCard/SettingsCard'
import { useUserProfileUpdateActorProfileMutation } from './userProfileUpdateActorProfile.mutation.generated'

interface ActorProfileSettingsCardProps {
  profile: UserProfileActorProfile
}

export const ActorProfileSettingsCard = ({
  profile: initialProfile,
}: ActorProfileSettingsCardProps) => {
  const { formatMessage } = useLocale()
  const [userProfileUpdateActorProfile] =
    useUserProfileUpdateActorProfileMutation()
  const [profile, setProfile] = useState(initialProfile)

  const onChange = async (active: boolean) => {
    const oldProfile = { ...profile }
    const newProfile = { ...profile, emailNotifications: active }
    setProfile(newProfile)

    try {
      await userProfileUpdateActorProfile({
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
