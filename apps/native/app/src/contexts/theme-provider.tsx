import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, StatusBar, useColorScheme } from 'react-native'
import { Navigation } from 'react-native-navigation'
import {
  DefaultTheme,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components'
import { usePreferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'
import { getDefaultOptions } from '../utils/get-default-options'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'
import { overrideUserInterfaceStyle } from '../utils/rn-island'

export function setStatusBar(theme: DefaultTheme) {
  const { modalsOpen } = uiStore.getState()
  const win = Dimensions.get('window')
  const isLandscape = win.width > win.height
  const isHandle =
    modalsOpen > 0 && Platform.OS === 'ios' && !Platform.isPad && !isLandscape

  StatusBar.setBarStyle(
    isHandle
      ? 'light-content'
      : theme.isDark
      ? 'light-content'
      : 'dark-content',
    true,
  )
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(theme.shade.background, true)
  }
}

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
    setStatusBar(selectedTheme)
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
    <StyledThemeProvider theme={selectedTheme}>{children}</StyledThemeProvider>
  )
}
