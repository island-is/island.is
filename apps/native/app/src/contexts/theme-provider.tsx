import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { Navigation, Options } from 'react-native-navigation'
import { useNavigation } from 'react-native-navigation-hooks/dist'
import {
  ThemeProvider as StyledThemeProvider,
  useTheme,
} from 'styled-components'
import { usePreferencesStore } from '../stores/preferences-store'
import { getDefaultOptions } from '../utils/get-default-options'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'
import { overrideUserInterfaceStyle } from '../utils/rn-island'

export function useScreenOptions(
  callback: () => Options | null | void,
  deps: any[] = [],
) {
  const theme = useTheme()
  const { mergeOptions } = useNavigation()
  useEffect(() => {
    const optionsToUpdate = callback?.()
    if (optionsToUpdate) {
      mergeOptions(optionsToUpdate)
    }
  }, deps)

  useEffect(() => {
    mergeOptions({
      topBar: {
        background: {
          color: theme.isDark ? '#000000' : '#ffffff',
        },
        barStyle: theme.isDark ? ('black' as any) : 'default',
        title: {
          color: theme.isDark ? theme.color.white : theme.color.blue400,
        },
        noBorder: true,
      },
      layout: {
        backgroundColor: theme.isDark ? '#000000' : '#ffffff',
        componentBackgroundColor: theme.isDark ? '#000000' : '#ffffff',
      },
      bottomTabs: {
        barStyle: theme.isDark ? 'black' : 'default',
        backgroundColor: theme.isDark ? '#000000' : '#ffffff',
      },
    })
  }, [theme])
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const scheme = useColorScheme()
  const preferences = usePreferencesStore()
  const selectedTheme = getThemeWithPreferences(preferences)

  useEffect(() => {
    Navigation.setDefaultOptions(getDefaultOptions(selectedTheme))
  }, [selectedTheme])

  useEffect(() => {
    overrideUserInterfaceStyle(preferences.appearanceMode)
  }, [preferences.appearanceMode])

  return (
    <StyledThemeProvider theme={selectedTheme}>{children}</StyledThemeProvider>
  )
}
