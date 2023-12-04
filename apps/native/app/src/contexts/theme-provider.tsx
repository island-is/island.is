import React, { useEffect, useState } from 'react'
import { Platform, StatusBar, useColorScheme } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { overrideUserInterfaceStyle } from '../lib/rn-island'
import { usePreferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'
import { getDefaultOptions } from '../utils/get-default-options'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const preferences = usePreferencesStore()
  const selectedTheme = getThemeWithPreferences(preferences, systemScheme)
  const [prevColorScheme, setPrevColorScheme] = useState(
    selectedTheme.colorScheme,
  )

  useEffect(() => {
    if (prevColorScheme !== selectedTheme.colorScheme) {
      Navigation.setDefaultOptions(getDefaultOptions(selectedTheme))
      setPrevColorScheme(selectedTheme.colorScheme)
    }
    uiStore.setState({ theme: selectedTheme })
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(
        preferences.appearanceMode === 'automatic'
          ? 'default'
          : selectedTheme.isDark
          ? 'light-content'
          : 'dark-content',
        true,
      )
    }
  }, [selectedTheme])

  useEffect(() => {
    overrideUserInterfaceStyle(
      preferences.appearanceMode === 'automatic'
        ? 'automatic'
        : selectedTheme.isDark
        ? 'dark'
        : 'light',
    )
  }, [preferences.appearanceMode])

  return (
    <StyledThemeProvider
      theme={{ ...selectedTheme, appearanceMode: preferences.appearanceMode }}
    >
      {children}
    </StyledThemeProvider>
  )
}
