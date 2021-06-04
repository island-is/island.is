import {
  Button,
  dynamicColor,
  font,
  Illustration,
} from '@island.is/island-ui-native'
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
import logo from '../../assets/logo/logo-64w.png'
import { FormattedMessage, useIntl } from '../../lib/intl'
import { openBrowser } from '../../lib/rn-island'
import { useAuthStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

const Host = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

const Title = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 26,
    color: (props) => ({ light: props.theme.color.dark400, dark: 'white' }),
  })}
  text-align: center;
  margin-top: 32px;
`

const BottomRow = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  padding: 32px;
`

const LightButtonText = styled.Text`
  ${font({
    fontWeight: '600',
    color: (props) => props.theme.color.blue400,
  })}
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
    <Host testID={testIDs.SCREEN_LOGIN}>
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
      <Illustration isBottomAligned />
    </Host>
  )
}

LoginScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
