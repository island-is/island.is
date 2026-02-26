import React, { useEffect, useMemo, useState } from 'react'
import {
  Appearance,
  DynamicColorIOS,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { usePreferencesStore } from '@/stores/preferences-store'
import { uiStore } from '@/stores/ui-store'
import { getThemeWithPreferences } from '@/utils/get-theme-with-preferences'
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const brokenSystemScheme = useColorScheme()
  const [systemScheme, setSystemScheme] = useState(brokenSystemScheme)
  const preferences = usePreferencesStore()
  const selectedTheme = getThemeWithPreferences(preferences, systemScheme)
  const [prevColorScheme, setPrevColorScheme] = useState(
    selectedTheme.colorScheme,
  )

  useEffect(() => {
    if (brokenSystemScheme !== 'unspecified') {
      setSystemScheme(brokenSystemScheme)
    }
  }, [brokenSystemScheme]);

  useEffect(() => {
    if (prevColorScheme !== selectedTheme.colorScheme) {
      setPrevColorScheme(selectedTheme.colorScheme)
    }
    uiStore.setState({ theme: selectedTheme })
    if (Platform.OS === 'ios' && preferences.appearanceMode === 'automatic') {
      StatusBar.setBarStyle('default', true)
    } else {
      StatusBar.setBarStyle(
        selectedTheme.isDark ? 'light-content' : 'dark-content',
        true,
      )
    }
  }, [selectedTheme])

  // @todo migration - This is uncessecery if we dont allow changing the theme.
  // Also its buggy.
  // useEffect(() => {
  //   Appearance.setColorScheme(
  //     preferences.appearanceMode === 'automatic'
  //       ? 'unspecified' // default to light, change back to 'automatic' when dark mode is ready
  //       : selectedTheme.isDark
  //       ? 'dark'
  //       : 'light',
  //   )
  // }, [preferences.appearanceMode])

  const navigationTheme = useMemo(() => {
    return {
      dark: selectedTheme.isDark,
      colors: {
        primary: selectedTheme.color.blue400,
        background: (Platform.OS === 'ios'
          ? DynamicColorIOS({
              light: selectedTheme.shade.background,
              dark: selectedTheme.shade.background,
            })
          : selectedTheme.shade.background) as string,
        card: selectedTheme.shade.shade200,
        text: selectedTheme.shade.foreground,
        border: selectedTheme.shade.shade300,
        notification: selectedTheme.color.red400,
      },
      fonts: {
        regular: {
          fontFamily: 'IBMPlexSans_400Regular',
          fontWeight: '400' as const,
        },
        medium: {
          fontFamily: 'IBMPlexSans_500Medium',
          fontWeight: '500' as const,
        },
        bold: {
          fontFamily: 'IBMPlexSans_600SemiBold',
          fontWeight: '600' as const,
        },
        heavy: {
          fontFamily: 'IBMPlexSans_700Bold',
          fontWeight: '700' as const,
        },
      }
    }
  }, [selectedTheme])

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StyledThemeProvider
        theme={{ ...selectedTheme, appearanceMode: preferences.appearanceMode }}
      >
        {children}
      </StyledThemeProvider>
    </NavigationThemeProvider>
  )
}
