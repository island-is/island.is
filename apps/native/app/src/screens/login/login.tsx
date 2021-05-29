import { Button, dynamicColor, font } from '@island.is/island-ui-native'
import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  DynamicColorIOS,
  Image,
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/digital-services-m1.png'
import gridDotSrc from '../../assets/illustrations/grid-dot.png'
import logo from '../../assets/logo/logo-64w.png'
import { useAuthStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { openBrowser } from '../../utils/rn-island'
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
      <Illustration>
        <DotGrid>
          <Image
            source={gridDotSrc}
            style={{
              width: '100%',
              height: '100%',
              tintColor: Platform.OS === 'android' ? theme.color.blue200 : DynamicColorIOS({
                  light: theme.color.blue200,
                  dark: 'rgba(204, 223, 255, 0.20)',
                }),
            }}
            resizeMode="repeat"
          />
        </DotGrid>
        <Image
          source={illustrationSrc}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            marginTop: 48,
            marginLeft: 32,
          }}
        />
      </Illustration>
    </Host>
  )
}

const Illustration = styled.SafeAreaView`
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue100,
    dark: props.theme.shades.dark.background,
  }))};
  height: 360px;
  max-height: 40%;
  align-items: center;
  margin-bottom: -32px;
`

const DotGrid = styled.View`
  position: absolute;
  top: 8px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding: 16px;
`

LoginScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
