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
import { safeAwait } from '@island.is/shared/utils'

type UserProfileNotificationSettings = {
  documentNotifications: boolean
  canNudge: boolean
  wantsPaper: boolean
}

export const NotificationSettings = () => {
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

  useEffect(() => {
    setSettings({ ...settings, wantsPaper: wantsPaper ?? false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsPaper])

  const onChange = async (
    updatedSettings: Partial<UserProfileNotificationSettings>,
  ) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, ...updatedSettings }
    setSettings(newSettings)

    const { error } = await safeAwait(
      updateUserProfile({
        variables: {
          input: {
            documentNotifications: newSettings.documentNotifications,
            canNudge: newSettings.canNudge,
          },
        },
      }),
    )

    if (error) {
      setSettings(oldSettings)
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  const onPaperMailChange = async (active: boolean) => {
    const { data, error } = await safeAwait(
      postPaperMailMutation({
        variables: {
          input: { wantsPaper: active },
        },
      }),
    )

    if (error) {
      toast.error(formatMessage(mNotifications.updateError))
      return
    }

    setSettings({
      ...settings,
      wantsPaper:
        data?.data?.postPaperMailInfo?.wantsPaper ?? settings.wantsPaper,
    })
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
