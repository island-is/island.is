import { Redirect, Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, Keyboard } from 'react-native'

import { authStore, useAuthStore } from '@/stores/auth-store'
import { isOnboarded } from '@/utils/onboarding'
import { useIntl } from 'react-intl'
import { config } from '../../config'
import { modalScreenOptions } from '../../constants/screen-options'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function AuthLayout() {
  const intl = useIntl()
  const router = useRouter()
  const authorizeResult = useAuthStore((s) => s.authorizeResult)
  const appStateRef = useRef(AppState.currentState)
  const lockScreenShownRef = useRef(false)

  const showLockScreen = useCallback(() => {
    if (lockScreenShownRef.current) return
    lockScreenShownRef.current = true
    router.push('/app-lock')
  }, [router])

  // Reset ref when the lock screen clears its own state (PIN/biometric unlock)
  useEffect(() => {
    return authStore.subscribe((state) => {
      if (!state.lockScreenActivatedAt && !state.lockScreenComponentId) {
        lockScreenShownRef.current = false
      }
    })
  }, [])

  // On mount: always show the lock screen if the user is onboarded.
  // The lock screen itself decides whether to auto-dismiss (within timeout) or require unlock.
  useEffect(() => {
    if (isOnboarded() && !config.isTestingApp) {
      showLockScreen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for app state changes to show/dismiss the lock screen
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const { noLockScreenUntilNextAppStateActive } = authStore.getState()

      // Going to background: stamp the time and show lock immediately (covers app switcher)
      if (
        appStateRef.current === 'active' &&
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
        if (isOnboarded() && !noLockScreenUntilNextAppStateActive) {
          Keyboard.dismiss()
          authStore.setState({ lockScreenActivatedAt: Date.now() })
          showLockScreen()
        }
      }

      // Returning to foreground: reset the suppress flag
      if (nextAppState === 'active' && noLockScreenUntilNextAppStateActive) {
        authStore.setState({ noLockScreenUntilNextAppStateActive: false })
      }

      appStateRef.current = nextAppState
    })

    return () => subscription.remove()
  }, [showLockScreen])

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
          headerTitle: intl.formatMessage({ id: 'personalInfo.screenTitle' }),
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
        name="app-lock"
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          gestureEnabled: false,
          animation: 'fade',
        }}
      />
    </Stack>
  )
}
