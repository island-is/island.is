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
import { useActorProfile } from '../../../hooks/useActorProfile'
import { usePaperMail } from '../../../hooks/usePaperMail'
import { mNotifications } from '../../../lib/messages'
import { NotificationSettingsCard } from '../cards/NotificationSettingsCard'
import { SettingsCard } from '../cards/SettingsCard/SettingsCard'
import { useUpdateActorProfileMutation } from './updateActorProfile.mutation.generated'
import { safeAwait } from '@island.is/shared/utils'

type Settings = {
  emailNotifications: boolean
  wantsPaper: boolean
}

export const ActorProfileNotificationSettings = () => {
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const { data: actorProfile, loading, error } = useActorProfile()

  const [updateActorProfile] = useUpdateActorProfileMutation()
  const {
    wantsPaper,
    postPaperMailMutation,
    loading: paperMailLoading,
  } = usePaperMail()

  const [settings, setSettings] = useState<Settings>({
    emailNotifications: actorProfile?.emailNotifications ?? true,
    wantsPaper: wantsPaper ?? false,
  })

  useEffect(() => {
    if (actorProfile) {
      setSettings({
        ...settings,
        emailNotifications: actorProfile.emailNotifications,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorProfile])

  const onChange = async (updatedSettings: Partial<Settings>) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, ...updatedSettings }

    setSettings(newSettings)

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

    if (error) {
      setSettings(oldSettings)
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  const onPaperMailChange = async (active: boolean) => {
    const oldSettings = { ...settings }
    const newSettings = { ...settings, wantsPaper: active }
    setSettings(newSettings)

    const { error, data } = await safeAwait(
      postPaperMailMutation({
        variables: {
          input: { wantsPaper: active },
        },
      }),
    )

    if (error) {
      toast.error(formatMessage(mNotifications.updateError))
      setSettings(oldSettings)
      return
    }

    setSettings({
      ...settings,
      wantsPaper:
        data?.data?.postPaperMailInfo?.wantsPaper ?? oldSettings.wantsPaper,
    })
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
