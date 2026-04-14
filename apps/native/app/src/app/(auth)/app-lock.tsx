import { selectionAsync } from 'expo-haptics'
import {
  authenticateAsync,
  AuthenticationType,
} from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { AppState, Image, SafeAreaView, View } from 'react-native'
import Keychain from 'react-native-keychain'
import styled from 'styled-components/native'

import { PinKeypad } from '@/components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '@/components/visualized-pin-code/visualized-pin-code'
import { authStore, useAuthStore } from '@/stores/auth-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { useUiStore } from '@/stores/ui-store'
import { dynamicColor, font } from '@/ui'
import { testIDs } from '@/utils/test-ids'

const MAX_PIN_CHARS = 4
const MAX_ATTEMPTS = 3

const Host = styled.View`
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

export default function AppLockScreen() {
  const router = useRouter()
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
    resetLockScreen()
    router.back()
  }

  const authenticateWithBiometrics = async () => {
    if (!useBiometrics || isPromptRef.current) {
      return
    }

    isPromptRef.current = true
    const response = await authenticateAsync()

    if (response.success) {
      void selectionAsync()
      unlockApp()
    } else {
      isPromptRef.current = false
    }
  }

  const handleLogout = async () => {
    await logout()
    resetLockScreen()
    router.replace('/login')
  }

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

  const loginAttempt = async (pin: string) => {
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

  // On mount: wait for the app to become active, then decide whether to auto-dismiss
  // (within timeout) or stay locked and prompt biometrics.
  useEffect(() => {
    const tryUnlockOrPrompt = () => {
      const { lockScreenActivatedAt } = authStore.getState()
      const { appLockTimeout } = preferencesStore.getState()

      const withinTimeout =
        lockScreenActivatedAt !== undefined &&
        lockScreenActivatedAt + appLockTimeout > Date.now()

      if (withinTimeout) {
        resetLockScreen()
        router.back()
        return
      }

      // Timeout expired or cold start — prompt biometrics
      void authenticateWithBiometrics()
    }

    if (AppState.currentState === 'active') {
      // Already active (cold start) — decide immediately
      tryUnlockOrPrompt()
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        isPromptRef.current = false
        tryUnlockOrPrompt()
      }
    })

    return () => subscription.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    isPromptRef.current = false
    authenticateWithBiometrics()
  }

  return (
    <Host testID={testIDs.SCREEN_APP_LOCK}>
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
            source={require('../../assets/logo/logo-64w.png')}
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
