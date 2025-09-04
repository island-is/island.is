import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Alert,
  AlertButton,
  Image,
  Linking,
  NativeModules,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import logo from '../../assets/logo/logo-64w.png'
import testinglogo from '../../assets/logo/testing-logo-64w.png'
import { environments, isTestingApp, useConfig } from '../../config'
import { openNativeBrowser } from '../../lib/rn-island'
import { showPicker } from '../../lib/show-picker'
import { useBrowser } from '../../lib/use-browser'
import { useAuthStore } from '../../stores/auth-store'
import {
  environmentStore,
  useEnvironmentStore,
} from '../../stores/environment-store'
import { preferencesStore } from '../../stores/preferences-store'
import { Button, dynamicColor, font } from '../../ui'
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

const Text = styled.Text`
  color: ${dynamicColor((props) => ({
    light: props.theme.color.dark400,
    dark: 'white',
  }))};
`

function getChromeVersion(): Promise<number> {
  return new Promise((resolve) => {
    NativeModules.IslandModule.getAppVersion(
      'com.android.chrome',
      (version: string) => {
        if (version) {
          resolve(Number(version?.split('.')?.[0] || 0))
        } else {
          resolve(0)
        }
      },
    )
  })
}

export const TestingLoginScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  const authStore = useAuthStore()
  const { environment = environments.prod, cognito } = useEnvironmentStore()
  const { openBrowser } = useBrowser()
  const intl = useIntl()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const onLoginPress = async () => {
    // Skip all login functionality if we are in mock environment
    if (environment.id === 'mock') {
      const { setupNativeMocking } = await import('@island.is/api/mocks/native')
      await setupNativeMocking()
      // Skip onboarding steps when mocking
      preferencesStore.setState({
        hasOnboardedBiometrics: true,
        hasOnboardedPinCode: true,
        hasOnboardedNotifications: true,
      })
      await nextOnboardingStep()
      return
    }
    const isCognitoAuth =
      cognito?.accessToken && cognito?.expiresAt > Date.now()
    if (
      environment.idsIssuer !== 'https://innskra.island.is/' &&
      !isCognitoAuth
    ) {
      Alert.alert(
        'Cognito required',
        'Please authenticate with cognito before logging in.',
      )
      return
    }

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
            zIndex: 3,
          }}
        >
          <Image
            source={isTestingApp ? testinglogo : logo}
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
      <DebugInfo componentId={componentId} />
    </Host>
  )
}

const DebugHost = styled.SafeAreaView`
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue100,
    dark: props.theme.shades.dark.background,
  }))};
  height: 360px;
  max-height: 40%;
  align-items: center;
  justify-content: center;
`

function DebugRow({ title, actions, value }: any) {
  const textStyle = {
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 32,
        minHeight: 28,
      }}
    >
      <Text
        style={{
          ...textStyle,
          fontWeight: 'bold',
          paddingRight: 8,
          minWidth: 64,
        }}
      >
        {title}
        {value ? ':' : ''}
      </Text>
      <Text selectable style={{ ...textStyle, flex: 1 }}>
        {value}
      </Text>
      {actions?.map((action: any, index: number) => (
        <Button
          key={index}
          isTransparent
          {...action}
          style={{
            paddingTop: 0,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 1,
            minWidth: 0,
          }}
          textStyle={{
            ...textStyle,
            fontWeight: 'bold',
            fontSize: 15,
          }}
        />
      ))}
    </View>
  )
}

function DebugInfo({ componentId }: { componentId: string }) {
  const {
    environment = environments.prod,
    cognito,
    actions,
    loading,
  } = useEnvironmentStore()
  const config = useConfig()

  const isCognitoAuth = cognito?.accessToken && cognito?.expiresAt > Date.now()
  const cognitoMinutes = Math.floor(
    (cognito?.expiresAt ? cognito.expiresAt - Date.now() : 0) / 1000 / 60,
  )

  const onEnvironmentPress = () => {
    if (loading) {
      return
    }
    environmentStore
      .getState()
      .actions.loadEnvironments()
      .then((res) => {
        showPicker({
          type: 'radio',
          title: 'Select environment',
          items: res,
          selectedId: environmentStore.getState().environment?.id,
          cancel: true,
        })
          .then(({ selectedItem }: any) => {
            if (!isCognitoAuth && selectedItem.id !== 'mock') {
              return Alert.alert(
                'Cognito Required',
                'You can use production without cognito login, but you need it for other environments.',
                [
                  environment.id !== 'prod' && {
                    text: 'Switch to Production',
                    onPress: () => {
                      actions.setEnvironment(environments.prod)
                    },
                  },
                  {
                    text: 'Login with cognito',
                    onPress: () => {
                      onCognitoLoginPress()
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ].filter(Boolean) as AlertButton[],
              )
            }
            environmentStore.getState().actions.setEnvironment(selectedItem)
          })
          .catch((err) => {
            // noop
          })
      })
  }

  const onCognitoLoginPress = () => {
    const params = {
      approval_prompt: 'prompt',
      client_id: config.cognitoClientId,
      redirect_uri: `${config.bundleId}://cognito`,
      response_type: 'token',
      scope: 'openid',
      state: 'state',
    }
    const url = `${config.cognitoUrl}?${new URLSearchParams(params)}`
    return openNativeBrowser(url, componentId)
  }

  return (
    <DebugHost>
      <DebugRow
        title="Label"
        value={environment?.label ?? 'N/A'}
        actions={[
          {
            title: '(Switch)',
            disabled: loading,
            onPress: onEnvironmentPress,
          },
        ]}
      />
      <DebugRow title="Bundle" value={config.bundleId} />
      <DebugRow title="IDS" value={environment?.idsIssuer ?? 'N/A'} />
      <DebugRow title="API" value={environment?.apiUrl ?? 'N/A'} />
      <DebugRow
        title="Cognito"
        value={isCognitoAuth ? `Yes (exp ${cognitoMinutes}m)` : 'No'}
        actions={[
          {
            title: '(Login)',
            onPress: onCognitoLoginPress,
          },
        ]}
      />
    </DebugHost>
  )
}

TestingLoginScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
