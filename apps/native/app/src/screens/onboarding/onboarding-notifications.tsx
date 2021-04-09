import { Button } from '@island.is/island-ui-native'
import React from 'react'
import { Image, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { OnBoarding } from '../../components/onboarding/onboarding'
import { preferencesStore } from '../../stores/preferences-store'
import { nextOnboardingStep } from '../../utils/onboarding'
import { Platform } from 'react-native'
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  AndroidImportance,
} from 'expo-notifications'
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

  const actions = (
    <View>
      <Button onPress={onAllowPress} title="Leyfa tilkynningar" testID={testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON} />
      <View style={{ height: 8 }} />
      <Button onPress={onSkipPress} title="Sleppa í bili" isTransparent testID={testIDs.ONBOARDING_NOTIFICATIONS_SKIP_BUTTON} />
    </View>
  )

  return (
    <OnBoarding
      testID={testIDs.SCREEN_ONBOARDING_NOTIFICATIONS}
      title="Tilkynningar"
      copy="Við getum sent þér tilkynningar í tækið þegar staða umsókna breytist eða nýtt rafrænt skjal er aðgengilegt."
      action={actions}
    >
      <Image
        style={{ width: 'auto' }}
        source={require('../../assets/illustrations/digital-services-m1.png')}
      />
    </OnBoarding>
  )
}

OnboardingNotificationsScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
}
