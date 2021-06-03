import {
  Button,
  CancelButton,
  Illustration,
  Onboarding
} from '@island.is/island-ui-native'
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync
} from 'expo-notifications'
import React from 'react'
import { Platform } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { preferencesStore } from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

enum PermissionStatus {
  GRANTED = 'granted',
  UNDETERMINED = 'undetermined',
  DENIED = 'denied',
}

async function registerForPushNotificationsAsync() {
  let finalStatus = PermissionStatus.UNDETERMINED
  const { status: existingStatus } = await getPermissionsAsync()
  finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await requestPermissionsAsync()
    finalStatus = status
  }

  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }
  return finalStatus
}

export const OnboardingNotificationsScreen: NavigationFunctionComponent = () => {
  const intl = useIntl()
  const onAllowPress = () => {
    registerForPushNotificationsAsync().then((status) => {
      if (status === PermissionStatus.DENIED) {
        // @todo Show manual steps to enable push notifications
      }
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
        />
      }
      buttonCancel={
        <CancelButton
          title={<FormattedMessage id="onboarding.notifications.decideLaterButtonText" />}
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
