import { Button, font } from '@island.is/island-ui-native'
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications'
import React from 'react'
import { Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import { preferencesStore } from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'
import { Illustration } from './illustration'

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

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
`

const CancelText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 16,
    color: (props) => props.theme.color.blue400,
  })}
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

  const actions = (
    <View>
      <Button
        onPress={onAllowPress}
        title="Leyfa tilkynningar"
        testID={testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON}
      />
      <View style={{ height: 8 }} />
      <Button
        onPress={onSkipPress}
        title="Sleppa í bili"
        isTransparent
        testID={testIDs.ONBOARDING_NOTIFICATIONS_SKIP_BUTTON}
      />
    </View>
  )

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
          <CancelText>
            <FormattedMessage id="onboarding.notifications.decideLaterButtonText" />
          </CancelText>
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
