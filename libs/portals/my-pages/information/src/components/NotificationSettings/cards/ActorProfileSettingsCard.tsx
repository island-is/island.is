import React, { FC, useState } from 'react'

import { useLocale } from '@island.is/localization'

import { SettingsCard } from './SettingsCard/SettingsCard'
import { mNotifications } from '../../../lib/messages'
import { useUpdateActorProfileMutation } from '../graphql/ActorProfiles.generated'
import { UserProfileActorProfile } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'

interface ActorProfileSettingsCardProps {
  profile: UserProfileActorProfile
}

export const ActorProfileSettingsCard: FC<ActorProfileSettingsCardProps> = ({
  profile: initialProfile,
}) => {
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
