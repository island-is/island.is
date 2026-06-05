import { Redirect, Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AppState, Keyboard, Platform } from 'react-native'
import { useIntl } from 'react-intl'

import { AppLock } from '@/components/app-lock/app-lock'
import { authStore, useAuthStore } from '@/stores/auth-store'
import { isOnboarded } from '@/utils/onboarding'
import { config } from '../../config'
import { modalScreenOptions } from '../../constants/screen-options'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function AuthLayout() {
  const intl = useIntl()
  const authorizeResult = useAuthStore((s) => s.authorizeResult)
  const appStateRef = useRef(AppState.currentState)

  // Stamp lockScreenActivatedAt on background. iOS also stamps on
  // active→inactive (Face ID overlay, app-switcher peek); Android skips
  // because 'inactive' there fires for non-backgrounding events.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current
      appStateRef.current = next

      if (!isOnboarded() || config.isTestingApp) return

      const wentToBackground = next === 'background' && prev !== 'background'
      const wentInactiveIOS =
        Platform.OS === 'ios' && prev === 'active' && next === 'inactive'

      if (!wentToBackground && !wentInactiveIOS) return

      Keyboard.dismiss()
      if (authStore.getState().lockScreenActivatedAt === undefined) {
        authStore.setState({ lockScreenActivatedAt: Date.now() })
      }
    })
    return () => sub.remove()
  }, [])

  if (!authorizeResult) {
    return <Redirect href="/login" />
  }

  return (
    <>
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
            headerTitle: intl.formatMessage({
              id: 'edit.bankinfo.screenTitle',
            }),
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
          name="(modals)/update-app"
          options={({ route }) => {
            const closable =
              (route.params as { closable?: string } | undefined)?.closable !==
              'false'
            if (closable) {
              return {
                ...modalScreenOptions,
                headerTitle: '',
              }
            }
            return {
              ...modalScreenOptions,
              headerTitle: '',
              headerShown: false,
              gestureEnabled: false,
              sheetGrabberVisible: false,
              presentation: Platform.OS === 'ios' ? 'fullScreenModal' : 'modal',
              unstable_headerRightItems: () => [],
            }
          }}
        />
      </Stack>
      <AppLock />
    </>
  )
}
