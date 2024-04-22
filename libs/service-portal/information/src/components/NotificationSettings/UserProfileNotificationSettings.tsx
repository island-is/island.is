import React, { useEffect, useState } from 'react'
import { NotificationSettingsCard } from './cards/NotificationSettingsCard'
import {
  AlertMessage,
  Divider,
  SkeletonLoader,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { useLocale } from '@island.is/localization'

import { SettingsCard } from './cards/SettingsCard/SettingsCard'
import { mNotifications } from '../../lib/messages'
import {
  useUpdateUserProfileMutation,
  useUserProfileSettingsQuery,
} from './graphql/UserProfile.generated'

type UserProfileNotificationSettings = {
  documentNotifications: boolean
  canNudge: boolean
}

const UserProfileNotificationSettings = () => {
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const {
    data: userProfile,
    loading,
    error: fetchError,
  } = useUserProfileSettingsQuery()
  const [updateUserProfile] = useUpdateUserProfileMutation()

  const [settings, setSettings] = useState<UserProfileNotificationSettings>({
    documentNotifications:
      userProfile?.getUserProfile?.documentNotifications ?? true,
    canNudge: userProfile?.getUserProfile?.canNudge ?? true,
  })

  useEffect(() => {
    if (userProfile?.getUserProfile) {
      setSettings({
        documentNotifications:
          userProfile?.getUserProfile.documentNotifications,
        canNudge: userProfile?.getUserProfile.canNudge ?? true,
      })
    }
  }, [userProfile])

  const onChange = async (
    updatedSettings: Partial<UserProfileNotificationSettings>,
  ) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, ...updatedSettings }
    setSettings(newSettings)

    try {
      await updateUserProfile({
        variables: {
          input: newSettings,
        },
      })
    } catch {
      setSettings(oldSettings)
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  if (loading) {
    return <SkeletonLoader borderRadius="large" height={326} />
  }

  if (fetchError) {
    return (
      <AlertMessage
        message={formatMessage(mNotifications.fetchErrorMessage)}
        title={formatMessage(mNotifications.fetchErrorTitle)}
        type="warning"
      />
    )
  }

  return (
    <NotificationSettingsCard title={userInfo?.profile.name}>
      <Stack space={[3, 4]}>
        <SettingsCard
          title={formatMessage(mNotifications.emailNotifications)}
          subtitle={formatMessage(mNotifications.emailNotificationsDescription)}
          toggleLabel={formatMessage(
            mNotifications.emailNotificationsAriaLabel,
          )}
          checked={settings.canNudge}
          onChange={(active: boolean) => onChange({ canNudge: active })}
        />
        <Divider />
        <SettingsCard
          title={formatMessage(mNotifications.appNotifications)}
          subtitle={formatMessage(mNotifications.appNotificationsDescription)}
          toggleLabel={formatMessage(mNotifications.appNotificationsAriaLabel)}
          checked={settings.documentNotifications}
          onChange={(active: boolean) =>
            onChange({ documentNotifications: active })
          }
        />
      </Stack>
    </NotificationSettingsCard>
  )
}

export default UserProfileNotificationSettings
