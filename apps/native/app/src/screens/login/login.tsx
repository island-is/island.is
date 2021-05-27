import { Button } from '@island.is/island-ui-native'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/digital-services-m1.png'
import logo from '../../assets/logo/logo-64w.png'
import { useAuthStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { openBrowser } from '../../utils/rn-island'
import { testIDs } from '../../utils/test-ids'

const Title = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 26px;
  line-height: 32px;
  text-align: center;
  color: ${(props) => props.theme.color.dark400};
  margin-top: 32px;
`

const Illustration = styled.SafeAreaView`
  background-color: ${(props) => props.theme.color.blue100};
  height: 330px;
  max-height: 35%;
  align-items: center;
`

const BottomRow = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  padding: 32px;
`

const LightButtonText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  color: ${(props) => props.theme.color.blue400};
`

export const LoginScreen: NavigationFunctionComponent = ({ componentId }) => {
  const authStore = useAuthStore()
  const intl = useIntl()

  const [authState, setAuthState] = useState<{
    nonce: string
    codeChallenge: string
    state: string
  } | null>(null)

  useEffect(() => {
    try {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNAppAuth)
      const onAuthRequestInitiated = (event: any) => setAuthState(event)
      const subscription = eventEmitter.addListener(
        'onAuthRequestInitiated',
        onAuthRequestInitiated,
      )
      return () => {
        subscription.remove()
      }
    } catch (err) {
      // noop
    }
  }, [])

  const onLoginPress = async () => {
    try {
      const isAuth = await authStore.login()
      if (isAuth) {
        const userInfo = await authStore.fetchUserInfo()
        if (userInfo) {
          await nextOnboardingStep()
        }
      }
    } catch (err) {
      if (err.message.indexOf('Connection error') >= 0) {
        Alert.alert(
          'Villa kom upp',
          '\nEkki náðist samband við innskráningarþjónustu.\n\nVinsamlegast athugið netsamband á tækinu eða reynið aftur síðar.',
        )
      } else {
        console.warn(err)
      }
    }
  }

  const onLanguagePress = () => {
    const { locale, setLocale } = preferencesStore.getState()
    setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
  }

  const onNeedHelpPress = () => {
    const helpDeskUrl = 'https://island.is/flokkur/thjonusta-island-is'
    openBrowser(helpDeskUrl, componentId)
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: 'white' }}
      testID={testIDs.SCREEN_LOGIN}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 32,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 48, height: 48 }}
          />
          <View style={{ maxWidth: 300, minHeight: 170 }}>
            <Title>
              <FormattedMessage id="login.welcomeMessage" />
            </Title>
          </View>
          <View style={{ position: 'absolute', opacity: 0, top: 0, left: 0 }}>
            <Text testID="auth_nonce">{authState?.nonce ?? 'noop1'}</Text>
            <Text testID="auth_code">
              {authState?.codeChallenge ?? 'noop2'}
            </Text>
            <Text testID="auth_state">{authState?.state ?? 'noop3'}</Text>
          </View>
          <Button
            title={intl.formatMessage({ id: 'login.loginButtonText' })}
            testID={testIDs.LOGIN_BUTTON_AUTHENTICATE}
            onPress={onLoginPress}
            style={{ width: 213 }}
          />
        </View>
        <BottomRow>
          <TouchableOpacity onPress={onLanguagePress}>
            <LightButtonText>
              <FormattedMessage id="login.languageButtonText" />
            </LightButtonText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNeedHelpPress}>
            <LightButtonText>
              <FormattedMessage id="login.needHelpButtonText" />
            </LightButtonText>
          </TouchableOpacity>
        </BottomRow>
      </SafeAreaView>
      <Illustration>
        <Image
          source={illustrationSrc}
          style={{ marginTop: -20, marginBottom: -40, marginRight: -60 }}
          resizeMode="contain"
        />
      </Illustration>
    </View>
  )
}

LoginScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'white',
    componentBackgroundColor: 'white',
    orientation: ['portrait'],
  },
}
