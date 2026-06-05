import { selectionAsync } from 'expo-haptics'
import {
  authenticateAsync,
  AuthenticationType,
} from 'expo-local-authentication'
import { router as routerImperative } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  AppState,
  BackHandler,
  Image,
  SafeAreaView,
  View,
} from 'react-native'
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
  ${font({ fontSize: 20 })}
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  ${font({ fontSize: 20 })}
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

function useBiometricType() {
  const { authenticationTypes } = useUiStore()
  if (authenticationTypes.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    return 'faceid'
  }
  if (authenticationTypes.includes(AuthenticationType.FINGERPRINT)) {
    return 'fingerprint'
  }
  if (authenticationTypes.includes(AuthenticationType.IRIS)) {
    return 'iris'
  }
  return undefined
}

export default function AppLockScreen() {
  const intl = useIntl()
  const isPromptingRef = useRef(false)
  const hasAutoPromptedRef = useRef(false)
  // Only a real background→active cycle resets the auto-prompt flag.
  // iOS Face ID cancel goes active→inactive→active (never 'background').
  const wentBackgroundRef = useRef(false)
  const [code, setCode] = useState('')
  const [invalidCode, setInvalidCode] = useState(false)

  const pinTries = usePreferencesStore((s) => s.pinTries)
  const useBiometrics = usePreferencesStore((s) => s.useBiometrics)
  const logout = useAuthStore((s) => s.logout)
  const biometricType = useBiometricType()
  const attemptsLeft = MAX_ATTEMPTS - pinTries

  // unlock() just clears the auth flag — the controller in components/app-lock
  // observes that and dismisses this route.
  const unlock = useCallback(() => {
    authStore.setState({ lockScreenActivatedAt: undefined })
  }, [])

  const attemptBiometric = useCallback(async () => {
    if (!useBiometrics || isPromptingRef.current) return
    isPromptingRef.current = true
    try {
      const res = await authenticateAsync()
      if (res.success) {
        void selectionAsync()
        unlock()
      }
    } finally {
      isPromptingRef.current = false
    }
  }, [useBiometrics, unlock])

  // Within grace = auto-unlock. Past grace = auto-prompt biometric once
  // per foreground (ref resets on each return-to-active).
  const decide = useCallback(() => {
    const { lockScreenActivatedAt } = authStore.getState()
    if (lockScreenActivatedAt === undefined) return

    const { appLockTimeout } = preferencesStore.getState()
    const elapsed = Date.now() - lockScreenActivatedAt
    if (elapsed < appLockTimeout) {
      unlock()
      return
    }
    if (hasAutoPromptedRef.current) return
    hasAutoPromptedRef.current = true
    void attemptBiometric()
  }, [unlock, attemptBiometric])

  useEffect(() => {
    if (AppState.currentState === 'active') decide()
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'background') {
        wentBackgroundRef.current = true
      } else if (next === 'active') {
        if (wentBackgroundRef.current) {
          hasAutoPromptedRef.current = false
          wentBackgroundRef.current = false
        }
        decide()
      }
    })
    return () => sub.remove()
  }, [decide])

  // Swallow Android hardware back; gestureEnabled:false handles iOS swipe.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])

  // Root layout keeps splash up on cold-start-with-lock; dismiss now that
  // the lock is on screen.
  useEffect(() => {
    void SplashScreen.hideAsync()
  }, [])

  const validatePin = async (pin: string) => {
    try {
      const res = await Keychain.getGenericPassword({ service: 'PIN_CODE' })
      return !!res && res.password === pin
    } catch {
      return false
    }
  }

  const handleLogout = async () => {
    await logout()
    routerImperative.replace('/login')
  }

  const loginAttempt = useCallback(
    async (pin: string) => {
      if (pin.length !== MAX_PIN_CHARS) return
      setInvalidCode(false)

      const ok = await validatePin(pin)
      if (ok) {
        preferencesStore.setState({ pinTries: 0 })
        unlock()
        return
      }
      // Read fresh — keeping pinTries in deps would cascade to logout on one wrong entry.
      const currentTries = preferencesStore.getState().pinTries
      if (currentTries + 1 >= MAX_ATTEMPTS) {
        preferencesStore.setState({ pinTries: 0 })
        void handleLogout()
        return
      }
      preferencesStore.setState((s) => ({ pinTries: s.pinTries + 1 }))
      setInvalidCode(true)
      setTimeout(() => setCode(''), 660)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unlock],
  )

  useEffect(() => {
    void loginAttempt(code)
  }, [code, loginAttempt])

  const onPinInput = (char: string) => {
    setCode((prev) => `${prev}${prev.length >= MAX_PIN_CHARS ? '' : char}`)
  }

  const onBackPress = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const onFaceIdPress = () => {
    void attemptBiometric()
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
                    attemptsLeft === 1
                      ? 'applock.attempt'
                      : 'applock.attempts',
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
