import { SkeletonLoader, Stack, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'

import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useActorProfile } from '../../../hooks/useActorProfile'
import { mNotifications } from '../../../lib/messages'
import { NotificationSettingsCard } from '../cards/NotificationSettingsCard'
import { SettingsCard } from '../cards/SettingsCard/SettingsCard'
import { useUpdateActorProfileMutation } from './updateActorProfile.mutation.generated'
import { safeAwait } from '@island.is/shared/utils'
import { useDelegationTypeFeatureFlag } from '../../../hooks/useDelegationTypeFeatureFlag'
import {
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import { AccessDenied } from '@island.is/portals/core'
import { useScopeAccess } from '../../../hooks/useScopeAccess'

type Settings = {
  emailNotifications: boolean
}

export const ActorProfileNotificationSettings = () => {
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  const { isDelegationTypeEnabled, isCheckingFeatureFlag } =
    useDelegationTypeFeatureFlag()
  const { hasUserProfileWriteScope } = useScopeAccess()
  const actorProfileResult = useActorProfile()
  const userProfileResult = useUserProfile()

  const {
    data: profile,
    loading,
    error,
  } = isDelegationTypeEnabled ? actorProfileResult : userProfileResult

  const [updateActorProfile] = useUpdateActorProfileMutation()

  const { updateUserProfile } = useUpdateUserProfile()

  const [settings, setSettings] = useState<Settings>({
    emailNotifications: profile?.emailNotifications ?? true,
  })

  useEffect(() => {
    if (profile) {
      setSettings({
        ...settings,
        emailNotifications: profile.emailNotifications ?? true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const onChange = async (updatedSettings: Partial<Settings>) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, ...updatedSettings }

    setSettings(newSettings)

    let updateError
    if (!isDelegationTypeEnabled) {
      const { error } = await safeAwait(
        updateUserProfile({
          canNudge: newSettings.emailNotifications,
        }),
      )
      updateError = error
    } else {
      const { error } = await safeAwait(
        updateActorProfile({
          variables: {
            input: {
              emailNotifications: newSettings.emailNotifications,
              fromNationalId: userInfo?.profile.nationalId,
            },
          },
        }),
      )
      updateError = error
    }
    if (updateError) {
      setSettings(oldSettings)
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  if (loading || isCheckingFeatureFlag) {
    return <SkeletonLoader borderRadius="large" height={473} />
  }

  if (error) {
    return <Problem error={error} size="small" />
  }

  if (!isDelegationTypeEnabled && !hasUserProfileWriteScope) {
    return <AccessDenied />
  }

  // This screen is only shown when acting on behalf of someone (UserNotifications
  // renders it only when isActor). Paper mail is a personal documents preference, not
  // an actor-profile setting, so we only show the email notifications toggle here.
  return (
    <NotificationSettingsCard title={userInfo?.profile.name}>
      <Stack space={[3, 4]}>
        <SettingsCard
          title={formatMessage(mNotifications.emailNotifications)}
          subtitle={formatMessage(mNotifications.emailNotificationsDescription)}
          toggleLabel={formatMessage(
            mNotifications.emailNotificationsAriaLabel,
          )}
          checked={settings.emailNotifications}
          onChange={(active) => onChange({ emailNotifications: active })}
        />
      </Stack>
    </NotificationSettingsCard>
  )
}
