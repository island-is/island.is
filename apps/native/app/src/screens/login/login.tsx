import { Button, dynamicColor, font } from '@island.is/island-ui-native'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { FormattedMessage, useIntl } from 'react-intl'
import { openBrowser } from '../../lib/rn-island'
import { useAuthStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { testIDs } from '../../utils/test-ids'
import { getMainRoot } from '../../utils/get-main-root'

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

function getChromeVersion(): Promise<number> {
  return new Promise((resolve) => {
    NativeModules.IslandModule.getAppVersion(
      'com.android.chrome',
      (version: string) => {
        resolve(Number(version?.split('.')?.[0] || 0))
      },
    )
  })
}

export const LoginScreen: NavigationFunctionComponent = ({ componentId }) => {
  const authStore = useAuthStore()
  const intl = useIntl()

  const [isLoggingIn, setIsLoggingIn] = useState(false)

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
    if (Platform.OS === 'android') {
      const chromeVersion = await getChromeVersion()
      if (chromeVersion < 55) {
        // Show dialog on how to update.
        Alert.alert(
          intl.formatMessage({ id: 'login.outdatedBrowserTitle' }),
          intl.formatMessage({ id: 'login.outdatedBrowserMessage' }),
          [
            {
              text: intl.formatMessage({
                id: 'login.outdatedBrowserUpdateButton',
              }),
              style: 'default',
              onPress() {
                Linking.openURL('market://details?id=com.android.chrome')
              },
            },
            {
              style: 'cancel',
              text: intl.formatMessage({
                id: 'login.outdatedBrowserCancelButton',
              }),
            },
          ],
        )
        return
      }
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
          Navigation.setRoot({ root: getMainRoot() })
        }
      }
    } catch (err) {
      if (err.message.indexOf('Connection error') >= 0) {
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

  return (
    <Host testID={testIDs.SCREEN_LOGIN}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 52,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 128, height: 128 }}
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
      </SafeAreaView>
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
