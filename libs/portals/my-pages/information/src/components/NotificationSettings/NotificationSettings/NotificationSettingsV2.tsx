import { SkeletonLoader, Stack, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef, useState } from 'react'

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
    error: paperMailError,
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
  const [updatingChannels, setUpdatingChannels] = useState(false)
  const channelUpdatePending = useRef(false)

  useEffect(() => {
    const profile = userProfile?.getUserProfile
    if (profile) {
      setSettings((current) => ({
        ...current,
        documentNotifications: profile.documentNotifications,
        canNudge: profile.canNudge ?? true,
        smsNotifications: profile.smsNotifications ?? false,
        onlyActionablePriorityNotifications:
          profile.onlyActionablePriorityNotifications ?? false,
      }))
    }
  }, [userProfile])

  useEffect(() => {
    if (wantsPaper !== null) {
      setSettings((current) => ({ ...current, wantsPaper }))
    }
  }, [wantsPaper])

  const onChange = async (
    key: 'documentNotifications' | 'canNudge' | 'smsNotifications',
    active: boolean,
  ) => {
    if (channelUpdatePending.current) return

    channelUpdatePending.current = true
    setUpdatingChannels(true)
    const previous = settings[key]
    setSettings((current) => ({ ...current, [key]: active }))

    try {
      const { error } = await safeAwait(
        updateUserProfile({ variables: { input: { [key]: active } } }),
      )

      if (error) {
        setSettings((current) => ({ ...current, [key]: previous }))
        toast.error(formatMessage(mNotifications.updateError))
      }
    } finally {
      channelUpdatePending.current = false
      setUpdatingChannels(false)
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

    setSettings((current) => ({
      ...current,
      wantsPaper:
        data?.data?.postPaperMailInfo?.wantsPaper ?? current.wantsPaper,
    }))
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
          {formatMessage(mNotifications.howIntroTitle)}
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
          disabled={updatingChannels}
          onChange={(active: boolean) => onChange('canNudge', active)}
        />

        <SettingsCard
          variant="card"
          title={formatMessage(mNotifications.appNotifications)}
          subtitle={formatMessage(mNotifications.appNotificationsDescription)}
          toggleLabel={formatMessage(mNotifications.appNotificationsAriaLabel)}
          checked={settings.documentNotifications}
          disabled={updatingChannels}
          onChange={(active: boolean) =>
            onChange('documentNotifications', active)
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
            disabled={updatingChannels}
            onChange={(active: boolean) => onChange('smsNotifications', active)}
          />
        )}
        {paperMailError && wantsPaper === null ? (
          <Stack space={1}>
            <Text variant="h5" as="h4">
              {formatMessage(mNotifications.paperMailTitle)}
            </Text>
            <Problem error={paperMailError} size="small" />
          </Stack>
        ) : (
          <SettingsCard
            variant="card"
            title={formatMessage(mNotifications.paperMailTitle)}
            subtitle={formatMessage(mNotifications.paperMailDescription)}
            toggleLabel={formatMessage(mNotifications.paperMailAriaLabel)}
            checked={settings.wantsPaper}
            onChange={onPaperMailChange}
          />
        )}
      </Stack>
    </Stack>
  )
}
