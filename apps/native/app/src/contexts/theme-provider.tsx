import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Platform } from 'react-native'
import { useColorScheme } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { usePreferencesStore } from '../stores/preferences-store'
import { getDefaultOptions } from '../utils/get-default-options'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'
import { overrideUserInterfaceStyle } from '../utils/rn-island'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const preferences = usePreferencesStore()
  const selectedTheme = getThemeWithPreferences(
    preferences,
    systemScheme ?? 'light',
  )
  const [prevColorScheme, setPrevColorScheme] = useState(
    selectedTheme.colorScheme,
  )

  useEffect(() => {
    if (prevColorScheme !== selectedTheme.colorScheme) {
      Navigation.setDefaultOptions(getDefaultOptions(selectedTheme))
      setPrevColorScheme(selectedTheme.colorScheme)
    }

    // Set status bar style
    StatusBar.setBarStyle(selectedTheme.isDark ? 'light-content' : 'dark-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(selectedTheme.shade.background, true);
    }
  }, [selectedTheme])

  useEffect(() => {
    overrideUserInterfaceStyle(preferences.appearanceMode)
  }, [preferences.appearanceMode])

  return (
    <StyledThemeProvider theme={selectedTheme}>{children}</StyledThemeProvider>
  )
}
