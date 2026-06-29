import { ThemeProvider as AppThemeProvider } from '@/components/providers/theme-provider'
import { PromptModal } from '@/components/prompt-modal'
import { ToastHost } from '@/components/toast'
import { Stack, usePathname } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef, useState } from 'react'
import 'react-native-reanimated'
import { DdRum } from '@datadog/mobile-react-native'

import { LocaleProvider } from '../components/providers/locale-provider'
import { OfflineProvider } from '../components/providers/offline-provider'
import { getApolloClientAsync } from '../graphql/client'
import { FeatureFlagProvider } from '../components/providers/feature-flag-provider'
import { ApolloProvider } from '@apollo/client'
import {
  authStore,
  checkIsAuthenticated,
  readAuthorizeResult,
} from '../stores/auth-store'
import { getNextOnboardingStep, isOnboarded } from '../utils/onboarding'
import { config } from '../config'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useFonts } from '@expo-google-fonts/ibm-plex-sans/useFonts'
import { IBMPlexSans_100Thin } from '@expo-google-fonts/ibm-plex-sans/100Thin'
import { IBMPlexSans_200ExtraLight } from '@expo-google-fonts/ibm-plex-sans/200ExtraLight'
import { IBMPlexSans_300Light } from '@expo-google-fonts/ibm-plex-sans/300Light'
import { IBMPlexSans_400Regular } from '@expo-google-fonts/ibm-plex-sans/400Regular'
import { IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans/500Medium'
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans/600SemiBold'
import { IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans/700Bold'
import { IBMPlexSans_100Thin_Italic } from '@expo-google-fonts/ibm-plex-sans/100Thin_Italic'
import { IBMPlexSans_200ExtraLight_Italic } from '@expo-google-fonts/ibm-plex-sans/200ExtraLight_Italic'
import { IBMPlexSans_300Light_Italic } from '@expo-google-fonts/ibm-plex-sans/300Light_Italic'
import { IBMPlexSans_400Regular_Italic } from '@expo-google-fonts/ibm-plex-sans/400Regular_Italic'
import { IBMPlexSans_500Medium_Italic } from '@expo-google-fonts/ibm-plex-sans/500Medium_Italic'
import { IBMPlexSans_600SemiBold_Italic } from '@expo-google-fonts/ibm-plex-sans/600SemiBold_Italic'
import { IBMPlexSans_700Bold_Italic } from '@expo-google-fonts/ibm-plex-sans/700Bold_Italic'
import { setupEventHandlers } from '../utils/lifecycle/setup-event-handlers'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    IBMPlexSans_100Thin,
    IBMPlexSans_200ExtraLight,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
    IBMPlexSans_100Thin_Italic,
    IBMPlexSans_200ExtraLight_Italic,
    IBMPlexSans_300Light_Italic,
    IBMPlexSans_400Regular_Italic,
    IBMPlexSans_500Medium_Italic,
    IBMPlexSans_600SemiBold_Italic,
    IBMPlexSans_700Bold_Italic,
  })

  const [appReady, setAppReady] = useState(false)
  const [apolloClient, setApolloClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null)

  // Initialize auth and Apollo on startup
  useEffect(() => {
    // Register all event handlers
    setupEventHandlers()

    async function init() {
      try {
        // 1. Restore auth tokens from keychain
        await readAuthorizeResult()

        // 2. Validate token: check required scopes, refresh if needed, fetch userinfo.
        //    Mirrors getAppRoot -> checkIsAuthenticated() from the old app.
        //    Will clear authorizeResult (→ redirect to /login) if token is invalid.
        const isAuthenticated = await checkIsAuthenticated()

        // 3. If authenticated, resolve async onboarding state (e.g. checks biometric
        //    hardware availability and auto-completes that step if absent).
        //    Mirrors getAppRoot -> getOnboardingScreens() from the old app.
        //    The reactive Redirect in (tabs)/_layout then drives routing.
        if (isAuthenticated) {
          await getNextOnboardingStep()
          // Stamp a past timestamp so the auth-layout mount effect pushes the
          // lock on cold start. Past grace forces auth (PIN/biometric) rather
          // than auto-unlock. Post-login mounts don't hit this path so the
          // stamp stays undefined → no lock right after login.
          if (isOnboarded() && !config.isTestingApp) {
            authStore.setState({
              lockScreenActivatedAt: Date.now() - 24 * 60 * 60 * 1000,
              biometricAutoPromptedForCurrentLock: false,
            })
          }
        }

        // 4. Initialize Apollo client (with persisted cache)
        const client = await getApolloClientAsync()
        setApolloClient(client)
      } catch (e) {
        console.warn('App init failed:', e)
      } finally {
        setAppReady(true)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (fontsError) throw fontsError
  }, [fontsError])

  useEffect(() => {
    if (!fontsLoaded || !appReady) {
      return
    }

    // Defer splash hide until the lock mounts (avoids tab flash); 2s fallback
    // so the splash never hangs.
    const { authorizeResult } = authStore.getState()
    const willPushLockScreen =
      !!authorizeResult && isOnboarded() && !config.isTestingApp

    if (!willPushLockScreen) {
      SplashScreen.hideAsync().catch(() => {})
      return
    }

    let cancelled = false
    let deferredId: ReturnType<typeof setTimeout> | undefined
    const hide = () => {
      if (cancelled) {
        return
      }
      cancelled = true
      SplashScreen.hideAsync().catch(() => {})
    }
    // componentId is set at React-commit time, before iOS finishes
    // presentViewController — wait a beat so the modal is on screen before
    // the splash drops.
    const hideAfterPresent = () => {
      deferredId = setTimeout(hide, 100)
    }

    if (authStore.getState().lockScreenComponentId) {
      hideAfterPresent()
      return () => {
        if (deferredId) {
          clearTimeout(deferredId)
        }
      }
    }

    const unsub = authStore.subscribe((state) => {
      if (state.lockScreenComponentId) {
        hideAfterPresent()
      }
    })
    const timeoutId = setTimeout(hide, 2000)

    return () => {
      clearTimeout(timeoutId)
      if (deferredId) {
        clearTimeout(deferredId)
      }
      unsub()
    }
  }, [fontsLoaded, appReady])

  if (!fontsLoaded || !appReady || !apolloClient) {
    return null
  }

  return <RootLayoutNav apolloClient={apolloClient} />
}

function RootLayoutNav({
  apolloClient,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
}) {
  // Restore Datadog RUM view tracking lost in the expo-router migration
  // (was previously wired through Navigation.events() in setup-globals.ts).
  const pathname = usePathname()
  const previousPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    if (__DEV__ || !pathname) {
      return
    }
    const previous = previousPathnameRef.current
    if (previous && previous !== pathname) {
      DdRum.stopView(previous).catch(() => {})
    }
    DdRum.startView(pathname, pathname).catch(() => {})
    previousPathnameRef.current = pathname
  }, [pathname])

  return (
    <LocaleProvider>
      <AppThemeProvider>
        <ApolloProvider client={apolloClient}>
          <FeatureFlagProvider>
            <OfflineProvider>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{ headerShown: false, animation: 'none' }}
                />
              </Stack>
              <PromptModal />
              <ToastHost />
            </OfflineProvider>
          </FeatureFlagProvider>
        </ApolloProvider>
      </AppThemeProvider>
    </LocaleProvider>
  )
}
