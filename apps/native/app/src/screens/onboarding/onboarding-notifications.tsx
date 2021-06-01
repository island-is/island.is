import {
  Button,
  CancelButton,
  font,
  Illustration
} from '@island.is/island-ui-native'
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync
} from 'expo-notifications'
import React from 'react'
import { Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import { preferencesStore } from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

const Title = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 28,
  })}
  text-align: center;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 64px;
`

const ButtonContainer = styled.View`
  margin-bottom: 32px;
`

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
    <View testID={testIDs.SCREEN_ONBOARDING_NOTIFICATIONS} style={{ flex: 1 }}>
      <Illustration />
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Title>
          <FormattedMessage id="onboarding.notifications.title" />
        </Title>
        <ButtonContainer>
          <Button
            title={intl.formatMessage({
              id: 'onboarding.notifications.allowNotificationsButtonText',
            })}
            onPress={onAllowPress}
            testID={testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON}
          />
        </ButtonContainer>
        <CancelButton
          onPress={onSkipPress}
          testID={testIDs.ONBOARDING_NOTIFICATIONS_SKIP_BUTTON}
        >
          <FormattedMessage id="onboarding.notifications.decideLaterButtonText" />
        </CancelButton>
      </SafeAreaView>
    </View>
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
