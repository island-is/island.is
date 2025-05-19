import {
  Divider,
  SkeletonLoader,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { NotificationSettingsCard } from '../cards/NotificationSettingsCard'

import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { usePaperMail } from '../../../hooks/usePaperMail'
import { mNotifications } from '../../../lib/messages'
import { SettingsCard } from '../cards/SettingsCard/SettingsCard'
import {
  useUpdateUserProfileSettingsMutation,
  useUserProfileSettingsQuery,
} from './getUserProfile.query.generated'

type UserProfileNotificationSettings = {
  documentNotifications: boolean
  canNudge: boolean
  wantsPaper: boolean
}

export const UserProfileNotificationSettings = () => {
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const {
    data: userProfile,
    loading,
    error: fetchError,
  } = useUserProfileSettingsQuery()
  const [updateUserProfile] = useUpdateUserProfileSettingsMutation()
  const {
    wantsPaper,
    postPaperMailMutation,
    loading: paperMailLoading,
  } = usePaperMail()

  const [settings, setSettings] = useState<UserProfileNotificationSettings>({
    documentNotifications:
      userProfile?.getUserProfile?.documentNotifications ?? true,
    canNudge: userProfile?.getUserProfile?.canNudge ?? true,
    wantsPaper: wantsPaper ?? false,
  })

  useEffect(() => {
    if (userProfile?.getUserProfile) {
      setSettings({
        ...settings,
        documentNotifications:
          userProfile?.getUserProfile.documentNotifications,
        canNudge: userProfile?.getUserProfile.canNudge ?? true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onPaperMailChange = async (active: boolean) => {
    try {
      await postPaperMailMutation({
        variables: {
          input: { wantsPaper: active },
        },
      })
      setSettings({ ...settings, wantsPaper: active })
    } catch {
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  if (loading || paperMailLoading) {
    return <SkeletonLoader borderRadius="large" height={473} />
  }

  if (fetchError) {
    return <Problem error={fetchError} size="small" />
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
          onChange={(active) => onChange({ canNudge: active })}
        />
        <Divider />
        <SettingsCard
          title={formatMessage(mNotifications.appNotifications)}
          subtitle={formatMessage(mNotifications.appNotificationsDescription)}
          toggleLabel={formatMessage(mNotifications.appNotificationsAriaLabel)}
          checked={settings.documentNotifications}
          onChange={(active) => onChange({ documentNotifications: active })}
        />
        <Divider />
        <SettingsCard
          title={formatMessage(mNotifications.paperMailTitle)}
          subtitle={formatMessage(mNotifications.paperMailDescription)}
          toggleLabel={formatMessage(mNotifications.paperMailAriaLabel)}
          checked={settings.wantsPaper}
          onChange={onPaperMailChange}
        />
      </Stack>
    </NotificationSettingsCard>
  )
}
