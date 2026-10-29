import { SkeletonLoader, Stack, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'

import { Problem } from '@island.is/react-spa/shared'
import { usePaperMail } from '../../../hooks/usePaperMail'
import { mNotifications } from '../../../lib/messages'
import { SettingsCard } from '../cards/SettingsCard/SettingsCard'
import {
  useUpdateUserProfileSettingsMutation,
  useUserProfileSettingsQuery,
} from '../NotificationSettings/getUserProfile.query.generated'
import { safeAwait } from '@island.is/shared/utils'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

type UserProfileNotificationSettings = {
  documentNotifications: boolean
  canNudge: boolean
  smsNotifications: boolean
  wantsPaper: boolean
  onlyActionablePriorityNotifications: boolean
}

export const NotificationSettingsV2 = () => {
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
  const { value: isSmsNotificationEnabled } = useFeatureFlag(
    Features.isSmsNotificationEnabled,
    false,
  )

  const [settings, setSettings] = useState<UserProfileNotificationSettings>({
    documentNotifications:
      userProfile?.getUserProfile?.documentNotifications ?? true,
    canNudge: userProfile?.getUserProfile?.canNudge ?? true,
    smsNotifications: userProfile?.getUserProfile?.smsNotifications ?? false,
    wantsPaper: wantsPaper ?? false,
    onlyActionablePriorityNotifications:
      userProfile?.getUserProfile?.onlyActionablePriorityNotifications ?? false,
  })

  useEffect(() => {
    if (userProfile?.getUserProfile) {
      setSettings({
        ...settings,
        documentNotifications:
          userProfile?.getUserProfile.documentNotifications,
        canNudge: userProfile?.getUserProfile.canNudge ?? true,
        smsNotifications: userProfile?.getUserProfile.smsNotifications ?? false,
        onlyActionablePriorityNotifications:
          userProfile?.getUserProfile.onlyActionablePriorityNotifications ??
          false,
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
            smsNotifications: newSettings.smsNotifications,
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
    <Stack space={4}>
      <Stack space={1}>
        <Text variant="h4" as="h2">
          Samskiptaleiðir
        </Text>
        <Text variant="medium">{formatMessage(mNotifications.howIntro)}</Text>
      </Stack>
      <Stack space={[3, 2]}>
        <SettingsCard
          variant="card"
          title={formatMessage(mNotifications.emailNotifications)}
          subtitle={formatMessage(mNotifications.emailNotificationsDescription)}
          toggleLabel={formatMessage(
            mNotifications.emailNotificationsAriaLabel,
          )}
          checked={settings.canNudge}
          onChange={(active: boolean) => onChange({ canNudge: active })}
        />

        <SettingsCard
          variant="card"
          title={formatMessage(mNotifications.appNotifications)}
          subtitle={formatMessage(mNotifications.appNotificationsDescription)}
          toggleLabel={formatMessage(mNotifications.appNotificationsAriaLabel)}
          checked={settings.documentNotifications}
          onChange={(active: boolean) =>
            onChange({ documentNotifications: active })
          }
        />

        {isSmsNotificationEnabled && (
          <SettingsCard
            variant="card"
            title={formatMessage(mNotifications.smsNotifications)}
            subtitle={formatMessage(mNotifications.smsNotificationsDescription)}
            toggleLabel={formatMessage(
              mNotifications.smsNotificationsAriaLabel,
            )}
            checked={settings.smsNotifications}
            onChange={(active: boolean) =>
              onChange({ smsNotifications: active })
            }
          />
        )}
        <SettingsCard
          variant="card"
          title={formatMessage(mNotifications.paperMailTitle)}
          subtitle={formatMessage(mNotifications.paperMailDescription)}
          toggleLabel={formatMessage(mNotifications.paperMailAriaLabel)}
          checked={settings.wantsPaper}
          onChange={onPaperMailChange}
        />
      </Stack>
    </Stack>
  )
}
