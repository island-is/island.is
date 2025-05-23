import {
  Divider,
  SkeletonLoader,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'

import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { usePaperMail } from '../../../hooks/usePaperMail'
import { mNotifications } from '../../../lib/messages'
import { NotificationSettingsCard } from '../cards/NotificationSettingsCard'
import { SettingsCard } from '../cards/SettingsCard/SettingsCard'
import { useUpdateActorProfileMutation } from './updateActorProfile.mutation.generated'
import { useUserProfileActorProfileQuery } from './userProfileActorProfile.query.generated'

type Settings = {
  emailNotifications: boolean
  wantsPaper: boolean
}

export const ActorProfileNotificationSettings = () => {
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const { data, loading, error } = useUserProfileActorProfileQuery()

  const [updateActorProfile] = useUpdateActorProfileMutation()
  const {
    wantsPaper,
    postPaperMailMutation,
    loading: paperMailLoading,
  } = usePaperMail()

  const [settings, setSettings] = useState<Settings>({
    emailNotifications:
      data?.userProfileActorProfile.emailNotifications ?? true,
    wantsPaper: wantsPaper ?? false,
  })

  useEffect(() => {
    if (data?.userProfileActorProfile) {
      setSettings({
        ...settings,
        emailNotifications: data.userProfileActorProfile.emailNotifications,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onChange = async (updatedSettings: Partial<Settings>) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, ...updatedSettings }

    setSettings(newSettings)

    try {
      await updateActorProfile({
        variables: {
          input: {
            emailNotifications: newSettings.emailNotifications,
            fromNationalId: userInfo?.profile.nationalId,
          },
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

  if (error) {
    return <Problem error={error} size="small" />
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
          checked={settings.emailNotifications}
          onChange={(active) => onChange({ emailNotifications: active })}
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
