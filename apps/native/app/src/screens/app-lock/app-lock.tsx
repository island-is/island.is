import { selectionAsync } from 'expo-haptics'
import {
  authenticateAsync,
  AuthenticationType,
} from 'expo-local-authentication'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, Image, SafeAreaView, View } from 'react-native'
import Keychain from 'react-native-keychain'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'

import { dynamicColor, font } from '../../ui'
import logo from '../../assets/logo/logo-64w.png'
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { authStore, useAuthStore } from '../../stores/auth-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { uiStore, useUiStore } from '../../stores/ui-store'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'

const MAX_PIN_CHARS = 4
const MAX_ATTEMPTS = 3

const Host = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${dynamicColor('background')};
`

const Title = styled.Text`
  ${font({
    fontSize: 20,
  })}
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  ${font({
    fontSize: 20,
  })}
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

function useBiometricType() {
  const { authenticationTypes } = useUiStore()
  if (authenticationTypes.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    return 'faceid'
  } else if (authenticationTypes.includes(AuthenticationType.FINGERPRINT)) {
    return 'fingerprint'
  } else if (authenticationTypes.includes(AuthenticationType.IRIS)) {
    return 'iris'
  }
  return undefined
}

export const AppLockScreen: NavigationFunctionComponent<{
  lockScreenActivatedAt?: number
  status: string
}> = ({ componentId, status }) => {
  const av = useRef(new Animated.Value(1)).current
  const isPromptRef = useRef(false)
  const [code, setCode] = useState('')
  const [invalidCode, setInvalidCode] = useState(false)

  const pinTries = usePreferencesStore(({ pinTries }) => pinTries)
  const attemptsLeft = MAX_ATTEMPTS - pinTries

  const useBiometrics = usePreferencesStore(
    ({ useBiometrics }) => useBiometrics,
  )

  const logout = useAuthStore(({ logout }) => logout)
  const biometricType = useBiometricType()
  const intl = useIntl()

  const resetLockScreen = () => {
    authStore.setState(() => ({
      lockScreenActivatedAt: undefined,
      lockScreenComponentId: undefined,
    }))
  }

  const unlockApp = () => {
    Animated.spring(av, {
      toValue: 0,
      useNativeDriver: true,
      delay: 100,
    }).start(() => {
      resetLockScreen()
      void Navigation.dismissOverlay(componentId)
      av.setValue(1)
    })
  }

  const authenticateWithBiometrics = async () => {
    if (!useBiometrics || isPromptRef.current) {
      // don't have biometrics or already prompted
      return
    }

    isPromptRef.current = true
    const response = await authenticateAsync()

    if (response.success) {
      void selectionAsync()
      unlockApp()
    }
  }

  /**
   * Logs out the user, resets lock screen state, and navigates to the app root
   */
  const handleLogout = async () => {
    await logout()
    resetLockScreen()

    await Promise.all([
      Navigation.dismissAllOverlays(),
      Navigation.dismissAllModals(),
    ])

    const root = await getAppRoot()
    await Navigation.setRoot({ root })
  }

  /**
   * Validates the provided pin against the stored pin in Keychain
   */
  const validatePin = async (pin: string) => {
    try {
      const res = await Keychain.getGenericPassword({ service: 'PIN_CODE' })

      if (res && res.password === pin) {
        return true
      }

      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * Handles a login attempt with the provided pin
   * - If the pin is correct, unlocks the app and resets attempts
   * - If the pin is incorrect and max attempts reached, logs out
   * - Otherwise, increments attempt counter and shows error
   */
  const loginAttempt = async (pin: string) => {
    // Do nothing if pin doesn't have the correct length
    if (pin.length !== MAX_PIN_CHARS) {
      return
    }

    setInvalidCode(false)
    const isValid = await validatePin(pin)

    if (isValid) {
      preferencesStore.setState({ pinTries: 0 })
      unlockApp()
      return
    }

    if (pinTries + 1 >= MAX_ATTEMPTS) {
      preferencesStore.setState({ pinTries: 0 })
      handleLogout()
      return
    }

    preferencesStore.setState((state) => ({
      pinTries: state.pinTries + 1,
    }))

    setInvalidCode(true)
    setTimeout(() => {
      setCode('')
    }, 660)
  }

  useEffect(() => {
    loginAttempt(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  useEffect(() => {
    if (status === 'active' && isPromptRef.current) {
      isPromptRef.current = false
    } else if (status === 'active') {
      void authenticateWithBiometrics()
    }
  }, [status])

  useNavigationComponentDidAppear(() => {
    authStore.setState(() => ({
      lockScreenComponentId: componentId,
    }))
    uiStore.setState({ initializedApp: true })
  })

  useNavigationComponentDidDisappear(() => {
    resetLockScreen()
  })

  const onPinInput = (char: string) => {
    setCode(
      (previousCode) =>
        `${previousCode}${previousCode.length >= MAX_PIN_CHARS ? '' : char}`,
    )
  }

  const onBackPress = () => {
    setCode(
      (previousCode) => `${previousCode.substr(0, previousCode.length - 1)}`,
    )
  }

  const onFaceIdPress = () => {
    // we know the prompt is not present at this time
    isPromptRef.current = false
    authenticateWithBiometrics()
  }

  return (
    <Host testID={testIDs.SCREEN_APP_LOCK} style={{ opacity: av }}>
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 20,
            maxHeight: 200,
            flex: 1,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45, marginBottom: 20 }}
          />
          <Title>{intl.formatMessage({ id: 'applock.title' })}</Title>
          <Subtitle>
            {pinTries > 0
              ? `${attemptsLeft} ${intl.formatMessage({
                  id:
                    attemptsLeft === 1 ? 'applock.attempt' : 'applock.attempts',
                })}`
              : ''}
          </Subtitle>
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalidCode}
            maxChars={MAX_PIN_CHARS}
          />
          <View style={{ height: 32 }} />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            onFaceIdPress={onFaceIdPress}
            back={code.length > 0}
            biometricType={
              useBiometrics ? biometricType ?? 'faceid' : undefined
            }
          />
          <View style={{ height: 64 }} />
        </Center>
      </SafeAreaView>
    </Host>
  )
}

AppLockScreen.options = {
  topBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'transparent',
    componentBackgroundColor: 'transparent',
    orientation: ['portrait'],
  },
}
