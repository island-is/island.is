import { selectionAsync } from 'expo-haptics'
import {
  authenticateAsync,
  AuthenticationType,
} from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  AppState,
  BackHandler,
  Image,
  InteractionManager,
  SafeAreaView,
  View,
} from 'react-native'
import Keychain from 'react-native-keychain'
import styled from 'styled-components/native'

import { PinKeypad } from '@/components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '@/components/visualized-pin-code/visualized-pin-code'
import {
  clearPendingDeepLink,
  consumePendingDeepLink,
  hasPendingDeepLink,
} from '@/app/+native-intent'
import {
  authStore,
  clearLockScreenSuppression,
  suppressLockScreen,
  useAuthStore,
} from '@/stores/auth-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { useUiStore } from '@/stores/ui-store'
import { dynamicColor, font } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { useBrowser } from '@/hooks/use-browser'

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
  const { openBrowser } = useBrowser()

  // Clear state before router.back so the layout's re-push subscriber
  // doesn't fire during unmount. Defer the deep-link replay until back has
  // settled — replaying with the lock still on top would push the link
  // above it, then back would pop the link instead of the lock.
  const unlockApp = () => {
    authStore.setState({
      lockScreenActivatedAt: undefined,
      biometricAutoPromptedForCurrentLock: false,
    })
    // Suppress lock re-arming during the dismiss + replay: iOS fires a
    // transient active→inactive that the auth layout would otherwise treat as
    // backgrounding and re-push the lock. Re-armed once it settles.
    suppressLockScreen()

    // With a pending link, clear the lock AND any open modal so the replay
    // lands on the tabs base — leaving a stale modal on top breaks its own
    // back/close ("GO_BACK was not handled"). A plain unlock keeps it.
    if (hasPendingDeepLink() && router.canDismiss()) {
      router.dismissAll()
    } else if (router.canGoBack()) {
      router.back()
    }
    // Replay after the dismiss settles — on setTimeout(0) the navigate races
    // the pop and gets dropped.
    InteractionManager.runAfterInteractions(() => {
      void consumePendingDeepLink(openBrowser)
      // Buffer the clear past the replayed screen's present animation.
      setTimeout(() => clearLockScreenSuppression(), 600)
    })
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
    authStore.setState({
      lockScreenActivatedAt: undefined,
      biometricAutoPromptedForCurrentLock: false,
    })
    clearPendingDeepLink()
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

  // Swallow Android hardware back.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])

  // Own a componentId so the layout can detect external pops and re-push.
  // Also clears lockScreenPushPending — the synchronous dedup flag set by the
  // pusher to prevent racing pushes before this mount commits.
  useEffect(() => {
    const id = `app-lock-${Date.now()}-${Math.random().toString(36).slice(2)}`
    authStore.setState({
      lockScreenComponentId: id,
      lockScreenPushPending: false,
    })
    return () => {
      if (authStore.getState().lockScreenComponentId === id) {
        authStore.setState({ lockScreenComponentId: undefined })
      }
    }
  }, [])

  // On mount and each → active: undefined → dismiss, within grace → unlock,
  // else → require auth (biometric prompted once per lock).
  useEffect(() => {
    const tryUnlockOrPrompt = () => {
      const { lockScreenActivatedAt, biometricAutoPromptedForCurrentLock } =
        authStore.getState()
      const { appLockTimeout } = preferencesStore.getState()

      if (lockScreenActivatedAt === undefined) {
        if (router.canGoBack()) {
          router.back()
        }
        return
      }

      const elapsed = Date.now() - lockScreenActivatedAt
      if (elapsed < appLockTimeout) {
        unlockApp()
        return
      }

      if (biometricAutoPromptedForCurrentLock) {
        return
      }
      authStore.setState({ biometricAutoPromptedForCurrentLock: true })
      void authenticateWithBiometrics()
    }

    if (AppState.currentState === 'active') {
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
