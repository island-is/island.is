import { getThemeWithPreferences } from '@/utils/get-theme-with-preferences'
import {
  ThemeProvider as NavigationThemeProvider
} from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import {
  DynamicColorIOS,
  Platform,
  StatusBar
} from 'react-native'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const appearanceMode = 'light' as const
  const selectedTheme = useMemo(() => getThemeWithPreferences({ appearanceMode }, appearanceMode), [appearanceMode]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);

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
        theme={{ ...selectedTheme, appearanceMode }}
      >
        {children}
      </StyledThemeProvider>
    </NavigationThemeProvider>
  )
}
