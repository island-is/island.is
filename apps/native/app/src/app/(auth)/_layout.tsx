import { Redirect, Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, Keyboard } from 'react-native'

import { authStore, useAuthStore } from '@/stores/auth-store'
import { isOnboarded } from '@/utils/onboarding'
import { config } from '../../config'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function AuthLayout() {
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
      // Going to background: stamp the time and show lock immediately (covers app switcher)
      if (
        appStateRef.current === 'active' &&
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
        if (isOnboarded()) {
          Keyboard.dismiss()
          authStore.setState({ lockScreenActivatedAt: Date.now() })
          showLockScreen()
        }
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
        name="(modals)"
        options={{
          headerShown: false,
          presentation: 'formSheet',
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
