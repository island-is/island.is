import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button, CancelButton, Illustration, Onboarding } from '@/ui'
import allow from '@/assets/icons/allow.png'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'
import { requestNotificationsPermission } from '@/utils/permissions'

export default function NotificationsScreen() {
  const intl = useIntl()

  const onAllowPress = () => {
    requestNotificationsPermission().then(() => {
      preferencesStore.setState({ hasOnboardedNotifications: true })
      nextOnboardingStep()
    })
  }

  const onSkipPress = () => {
    preferencesStore.setState({ hasOnboardedNotifications: true })
    nextOnboardingStep()
  }

  return (
    <Onboarding
      illustration={<Illustration />}
      title={<FormattedMessage id="onboarding.notifications.title" />}
      buttonSubmit={
        <Button
          title={intl.formatMessage({
            id: 'onboarding.notifications.allowNotificationsButtonText',
          })}
          onPress={onAllowPress}
          icon={allow}
        />
      }
      buttonCancel={
        <CancelButton
          title={
            <FormattedMessage id="onboarding.notifications.decideLaterButtonText" />
          }
          onPress={onSkipPress}
        />
      }
    />
  )
}
