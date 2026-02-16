import { ThemeProvider as AppThemeProvider } from '@/components/providers/theme-provider'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { LocaleProvider } from '../components/providers/locale-provider'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <LocaleProvider>
        <AppThemeProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{ headerShown: false, animation: 'none' }}
            />
          </Stack>
        </AppThemeProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
