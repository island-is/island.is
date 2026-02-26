import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '@/assets/logo/logo-64w.png'
import testingLogo from '@/assets/logo/testing-logo-64w.png'
import { isTestingApp } from '@/config'
import { environments } from '@/constants/environments'
import { DebugInfo } from '@/components/testing/debug-info'
import { useBrowser } from '@/hooks/use-browser'
import { useAuthStore, authStore as rawAuthStore } from '@/stores/auth-store'
import { useEnvironmentStore } from '@/stores/environment-store'
import { preferencesStore } from '@/stores/preferences-store'
import { Button, dynamicColor, font, Illustration } from '@/ui'
import { nextOnboardingStep } from '@/utils/onboarding'
import { testIDs } from '@/utils/test-ids'
import * as WebBrowser from 'expo-web-browser'

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

export default function LoginScreen() {
  const authStore = useAuthStore()
  const { environment = environments.prod, cognito } = useEnvironmentStore()
  const { openBrowser } = useBrowser()
  const intl = useIntl()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const onLoginPress = async () => {
    if (environment.id === 'mock') {
      const { setupNativeMocking } = await import('@island.is/api/mocks/native')
      await setupNativeMocking()
      preferencesStore.setState({
        hasOnboardedBiometrics: true,
        hasOnboardedPinCode: true,
        hasOnboardedNotifications: true,
      })
      rawAuthStore.setState({
        authorizeResult: {
          accessToken: 'mock-access-token',
          tokenType: 'Bearer',
          accessTokenExpirationDate: new Date(Date.now() + 3600 * 1000).toISOString(),
          authorizationCode: 'mock-authorization-code',
          idToken: 'mock-id-token',
          refreshToken: 'mock-refresh-token',
        },
        userInfo: {
          name: 'Mock User',
          nationalId: '0000000000',
          sub: 'mock-user'
        }
      })
      await nextOnboardingStep()
      return
    }

    const isCognitoAuth = cognito?.accessToken && cognito?.expiresAt > Date.now()
    if (environment.idsIssuer !== environments.prod.idsIssuer && !isCognitoAuth) {
      Alert.alert(
        'Cognito required',
        'Please authenticate with cognito before logging in.',
      )
      return
    }

    if (isLoggingIn) {
      return
    }

    setIsLoggingIn(true)
    try {
      const isAuth = await authStore.login()
      if (isAuth) {
        const userInfo = await authStore.fetchUserInfo()
        if (userInfo) {
          await nextOnboardingStep()
        }
      }
    } catch (err) {
      if ((err as Error).message.indexOf('Connection error') >= 0) {
        Alert.alert(
          intl.formatMessage({ id: 'login.networkErrorTitle' }),
          intl.formatMessage({ id: 'login.networkErrorMessage' }),
        )
      } else {
        console.warn(err)
      }
    }
    setIsLoggingIn(false)
  }

  const onLanguagePress = () => {
    const { locale, setLocale } = preferencesStore.getState()
    setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
  }

  const onNeedHelpPress = () => {
    const helpDeskUrl = 'https://island.is/flokkur/thjonusta-island-is'
    openBrowser(helpDeskUrl)
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
            zIndex: 3,
          }}
        >
          <Image
            source={isTestingApp ? testingLogo : logo}
            resizeMode="contain"
            style={{ width: 48, height: 48 }}
          />
          <View style={{ maxWidth: 300, minHeight: 170 }}>
            <Title>
              <FormattedMessage id="login.welcomeMessage" />
            </Title>
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
      {isTestingApp ? <DebugInfo /> : <Illustration isBottomAligned />}
    </Host>
  )
}
