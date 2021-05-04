import { Button } from '@island.is/island-ui-native'
import React from 'react'
import { SafeAreaView, Platform, Image, View } from 'react-native'
import { nextOnboardingStep } from '../../utils/onboarding'
import image from '../../assets/illustrations/digital-services-m1.png'
import styled from 'styled-components/native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { preferencesStore } from '../../stores/preferences-store'
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  AndroidImportance,
} from 'expo-notifications'
import { testIDs } from '../../utils/test-ids'
import { FormattedMessage, useIntl } from '../../utils/intl';

const Illustration = styled.SafeAreaView`
  background-color: ${(props) => props.theme.color.blue100};
  /* margin-bottom: 45px; */
  margin-top: -32px;
`

const Title = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: ${(props) => props.theme.color.dark400};
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
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.blue400};
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
      <Illustration>
        <Image source={image} style={{ marginBottom: -44 }} />
      </Illustration>
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
          />
        </ButtonContainer>
        <CancelButton onPress={onSkipPress}>
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
}
