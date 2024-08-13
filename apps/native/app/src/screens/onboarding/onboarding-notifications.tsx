import messaging from '@react-native-firebase/messaging'
import { Button, CancelButton, Illustration, Onboarding } from '@ui'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { PermissionsAndroid } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import allow from '../../assets/icons/allow.png'
import { preferencesStore } from '../../stores/preferences-store'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'
import { androidIsVersion33OrAbove } from '../../utils/versions-check'

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission()

  if (androidIsVersion33OrAbove()) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    return granted === PermissionsAndroid.RESULTS.GRANTED
  }

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  )
}

export const OnboardingNotificationsScreen: NavigationFunctionComponent =
  () => {
    const intl = useIntl()
    const onAllowPress = () => {
      requestUserPermission().then(() => {
        preferencesStore.setState(() => ({ hasOnboardedNotifications: true }))
        return nextOnboardingStep()
      })
    }

    const onSkipPress = () => {
      preferencesStore.setState(() => ({ hasOnboardedNotifications: true }))
      return nextOnboardingStep()
    }

    return (
      <Onboarding
        testID={testIDs.SCREEN_ONBOARDING_NOTIFICATIONS}
        illustration={<Illustration />}
        title={<FormattedMessage id="onboarding.notifications.title" />}
        buttonSubmit={
          <Button
            title={intl.formatMessage({
              id: 'onboarding.notifications.allowNotificationsButtonText',
            })}
            onPress={onAllowPress}
            testID={testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON}
            icon={allow}
          />
        }
        buttonCancel={
          <CancelButton
            title={
              <FormattedMessage id="onboarding.notifications.decideLaterButtonText" />
            }
            onPress={onSkipPress}
            testID={testIDs.ONBOARDING_NOTIFICATIONS_SKIP_BUTTON}
          />
        }
      />
    )
  }

OnboardingNotificationsScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
