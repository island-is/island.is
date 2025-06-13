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
import { authStore } from '../../stores/auth-store'
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
  const pinTries = preferencesStore.getState().pinTries
  const [attempts, setAttempts] = useState(pinTries)
  const attemptsLeft = MAX_ATTEMPTS - attempts

  const { useBiometrics } = usePreferencesStore()
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

  useEffect(() => {
    setInvalidCode(false)
    if (code.length === MAX_PIN_CHARS) {
      // pinTries (attempts) starts at 0, so we need to subtract 1 to get the correct number of attempts
      if (attempts === MAX_ATTEMPTS - 1) {
        // maximum attempts reached
        authStore
          .getState()
          .logout()
          .then(() => {
            // you are now logged out and navigated to root screen
            resetLockScreen()
            Navigation.dismissAllOverlays()
            Navigation.dismissAllModals()
            getAppRoot().then((root) => Navigation.setRoot({ root }))
          })
      } else {
        // matching pin code
        Keychain.getGenericPassword({ service: 'PIN_CODE' })
          .then((res) => {
            if (res && res.password === code) {
              preferencesStore.setState({ pinTries: 0 })
              unlockApp()
            } else {
              // increment attemps, reset code and display warning
              setAttempts((previousAttempts) => previousAttempts + 1)
              preferencesStore.setState((state) => ({
                pinTries: state.pinTries + 1,
              }))
              setInvalidCode(true)
              setTimeout(() => {
                setCode('')
              }, 660)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }, [code])

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
            {attempts > 0
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
