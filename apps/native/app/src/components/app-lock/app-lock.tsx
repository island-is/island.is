import { selectionAsync } from 'expo-haptics'
import {
  authenticateAsync,
  AuthenticationType,
} from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  AppState,
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Keychain from 'react-native-keychain'
import styled from 'styled-components/native'

import { PinKeypad } from '@/components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '@/components/visualized-pin-code/visualized-pin-code'
import { config } from '@/config'
import { authStore, useAuthStore } from '@/stores/auth-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { useUiStore } from '@/stores/ui-store'
import { dynamicColor, font } from '@/ui'
import { isOnboarded } from '@/utils/onboarding'
import { testIDs } from '@/utils/test-ids'

const MAX_PIN_CHARS = 4
const MAX_ATTEMPTS = 3
const FADE_OUT_MS = 220

const Host = styled(Animated.View)`
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

function useShouldShowLock() {
  const lockScreenActivatedAt = useAuthStore((s) => s.lockScreenActivatedAt)
  const lockScreenSuppressedUntil = useAuthStore(
    (s) => s.lockScreenSuppressedUntil,
  )
  const authorizeResult = useAuthStore((s) => s.authorizeResult)
  const dev__useLockScreen = usePreferencesStore((s) => s.dev__useLockScreen)

  if (lockScreenActivatedAt === undefined) return false
  if (!authorizeResult) return false
  if (!isOnboarded()) return false
  if (config.isTestingApp) return false
  if (dev__useLockScreen === false) return false
  // Suppression hides the overlay but doesn't stop background-stamping —
  // when it clears, the lock shows if the user backgrounded in the meantime.
  if (
    lockScreenSuppressedUntil != null &&
    Date.now() < lockScreenSuppressedUntil
  ) {
    return false
  }
  return true
}

export function AppLock() {
  const shouldShow = useShouldShowLock()
  const [renderable, setRenderable] = useState(shouldShow)
  const opacity = useSharedValue(shouldShow ? 1 : 0)

  // Instant show; fade out on unlock. Re-lock mid-fade snaps back to 1.
  useEffect(() => {
    if (shouldShow) {
      setRenderable(true)
      opacity.value = 1
      return
    }
    if (!renderable) return
    opacity.value = withTiming(
      0,
      { duration: FADE_OUT_MS, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setRenderable)(false)
      },
    )
  }, [shouldShow, renderable, opacity])

  if (!renderable) return null

  return <AppLockContent fading={!shouldShow} opacity={opacity} />
}

function AppLockContent({
  fading,
  opacity,
}: {
  fading: boolean
  opacity: SharedValue<number>
}) {
  const router = useRouter()
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
    if (fading) return
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
  }, [fading, unlock, attemptBiometric])

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

  // Swallow Android hardware back.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
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
    router.replace('/login')
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
      if (pinTries + 1 >= MAX_ATTEMPTS) {
        preferencesStore.setState({ pinTries: 0 })
        void handleLogout()
        return
      }
      preferencesStore.setState((s) => ({ pinTries: s.pinTries + 1 }))
      setInvalidCode(true)
      setTimeout(() => setCode(''), 660)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinTries, unlock],
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

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => undefined}
    >
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={fading ? 'none' : 'auto'}
      >
        <Host style={animatedStyle} testID={testIDs.SCREEN_APP_LOCK}>
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
      </View>
    </Modal>
  )
}
