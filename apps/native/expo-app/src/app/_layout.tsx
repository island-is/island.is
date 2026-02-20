import { ThemeProvider as AppThemeProvider } from '@/components/providers/theme-provider'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'

import { LocaleProvider } from '../components/providers/locale-provider'
import { getApolloClientAsync } from '../graphql/client'
import { FeatureFlagProvider } from '../components/providers/feature-flag-provider'
import { ApolloProvider } from '@apollo/client'
import { checkIsAuthenticated, readAuthorizeResult } from '../stores/auth-store'
import { getNextOnboardingStep } from '../utils/onboarding'
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
  const [
    apolloClient,
    setApolloClient,
  ] = useState<ApolloClient<NormalizedCacheObject> | null>(null)

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
    if (fontsLoaded && appReady) {
      SplashScreen.hideAsync()
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
  return (
    <LocaleProvider>
      <AppThemeProvider>
        <FeatureFlagProvider>
          <ApolloProvider client={apolloClient}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="login"
                options={{ headerShown: false, animation: 'none' }}
              />
            </Stack>
          </ApolloProvider>
        </FeatureFlagProvider>
      </AppThemeProvider>
    </LocaleProvider>
  )
}
