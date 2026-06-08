import { Redirect, Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, Keyboard, Platform } from 'react-native'

import {
  authStore,
  isLockScreenSuppressed,
  useAuthStore,
} from '@/stores/auth-store'
import { isOnboarded } from '@/utils/onboarding'
import { useIntl } from 'react-intl'
import { config } from '../../config'
import {
  modalScreenOptions,
  tabScreenOptions,
} from '../../constants/screen-options'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// Past timestamp so grace-check fails on cold-start (auth required).
const COLD_START_ACTIVATED_AT = () => Date.now() - 24 * 60 * 60 * 1000

export default function AuthLayout() {
  const intl = useIntl()
  const router = useRouter()
  const authorizeResult = useAuthStore((s) => s.authorizeResult)
  const appStateRef = useRef(AppState.currentState)

  const pushLockScreen = useCallback(() => {
    if (authStore.getState().lockScreenComponentId) return
    router.push('/app-lock')
  }, [router])

  // Cold-start: lock immediately, require auth (not grace).
  useEffect(() => {
    if (!isOnboarded() || config.isTestingApp) return
    authStore.setState({
      lockScreenActivatedAt: COLD_START_ACTIVATED_AT(),
      biometricAutoPromptedForCurrentLock: false,
    })
    pushLockScreen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-push if the modal gets popped while still locked (deep-link races).
  useEffect(() => {
    return authStore.subscribe((state, prev) => {
      if (
        prev.lockScreenComponentId &&
        !state.lockScreenComponentId &&
        state.lockScreenActivatedAt !== undefined &&
        isOnboarded() &&
        !config.isTestingApp
      ) {
        router.push('/app-lock')
      }
    })
  }, [router])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current
      appStateRef.current = nextAppState

      if (!isOnboarded() || config.isTestingApp) return
      if (isLockScreenSuppressed()) return

      // → background: stamp grace clock (once per lock session).
      if (
        nextAppState === 'background' &&
        previousAppState !== 'background'
      ) {
        Keyboard.dismiss()
        if (authStore.getState().lockScreenActivatedAt === undefined) {
          authStore.setState({
            lockScreenActivatedAt: Date.now(),
            biometricAutoPromptedForCurrentLock: false,
          })
        }
        pushLockScreen()
        return
      }

      // iOS-only: stamp + mount on active→inactive (Face ID overlay, Simulator
      // skipping 'background', app-switcher peek). Skipping on Android because
      // 'inactive' there fires for non-backgrounding events (screen
      // transitions, system dialogs) and would re-lock right after unlock.
      if (
        Platform.OS === 'ios' &&
        previousAppState === 'active' &&
        nextAppState === 'inactive'
      ) {
        if (authStore.getState().lockScreenActivatedAt === undefined) {
          authStore.setState({
            lockScreenActivatedAt: Date.now(),
            biometricAutoPromptedForCurrentLock: false,
          })
        }
        pushLockScreen()
        return
      }

      // → active while still locked: re-push if modal was popped.
      if (
        nextAppState === 'active' &&
        previousAppState !== 'active' &&
        authStore.getState().lockScreenActivatedAt !== undefined
      ) {
        pushLockScreen()
      }
    })

    return () => subscription.remove()
  }, [pushLockScreen])

  if (!authorizeResult) {
    return <Redirect href="/login" />
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/personal-info"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'familyDetail.title' }),
        }}
      />
      <Stack.Screen
        name="(modals)/settings"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'setting.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/edit-phone"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'edit.phone.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/edit-confirm"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'edit.confirm.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/edit-email"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'edit.email.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/edit-bank-info"
        options={{
          ...modalScreenOptions,
          headerTitle: intl.formatMessage({ id: 'edit.bankinfo.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/notifications"
        options={{
          ...modalScreenOptions,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(modals)/homescreen-options"
        options={{
          ...modalScreenOptions,
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          headerTitle: intl.formatMessage({ id: 'homeOptions.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="(modals)/passkey"
        options={{
          ...modalScreenOptions,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="app-lock"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          gestureEnabled: false,
          animation: 'none',
        }}
      />
    </Stack>
  )
}
