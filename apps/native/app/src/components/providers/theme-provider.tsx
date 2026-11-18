import { usePreferencesStore } from '@/stores/preferences-store'
import { getThemeWithPreferences } from '@/utils/get-theme-with-preferences'
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import {
  DynamicColorIOS,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const appearanceMode = usePreferencesStore((s) => s.appearanceMode)
  const systemScheme = useColorScheme()
  const selectedTheme = useMemo(
    () => getThemeWithPreferences({ appearanceMode }, systemScheme),
    [appearanceMode, systemScheme],
  )

  useEffect(() => {
    StatusBar.setBarStyle(
      selectedTheme.isDark ? 'light-content' : 'dark-content',
      true,
    )
  }, [selectedTheme.isDark])

  const navigationTheme = useMemo(() => {
    const { tokens, tokenModes } = selectedTheme
    return {
      dark: selectedTheme.isDark,
      colors: {
        primary: tokens.interactive.foreground.primary,
        background: (Platform.OS === 'ios' && appearanceMode === 'automatic'
          ? DynamicColorIOS({
              light: tokenModes.light.background.invert,
              dark: tokenModes.dark.background.invert,
            })
          : tokens.background.invert) as string,
        card: tokens.app.background.header,
        text: tokens.foreground.primary,
        border: tokens.app.border.subtle,
        notification: tokens.feedback.error.foreground,
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
      },
    }
  }, [selectedTheme, appearanceMode])

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StyledThemeProvider theme={{ ...selectedTheme, appearanceMode }}>
        {children}
      </StyledThemeProvider>
    </NavigationThemeProvider>
  )
}
