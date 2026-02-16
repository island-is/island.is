import { Redirect, Stack, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'

import { useAuthStore } from '@/stores/_mock-auth'

export default function AppLayout() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isOnboarded = useAuthStore((s) => s.hasOnboarded)
  const isLocked = useAuthStore((s) => s.isLocked)
  const lock = useAuthStore((s) => s.lock)
  const appStateRef = useRef(AppState.currentState)

  // Listen for app state changes to trigger lock
  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', (nextAppState) => {
  //     if (
  //       appStateRef.current === 'active' &&
  //       nextAppState.match(/inactive|background/)
  //     ) {
  //       if (isAuthenticated) {
  //         console.log('locking');
  //         lock()
  //       }
  //     }
  //     appStateRef.current = nextAppState
  //   })

  //   return () => subscription.remove()
  // }, [])

  // Navigate to app-lock when locked
  useEffect(() => {
    if (isAuthenticated && isLocked) {
      console.log('opening app lock');
      router.push('/app-lock')
    }
  }, [isAuthenticated, isLocked, router])

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  console.log('rendering auth layout');

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="app-lock"
        options={{
          headerShown: false,
          presentation: 'containedTransparentModal',
          // gestureEnabled: false,
        }}
      />
    </Stack>
  )
}
