import { theme } from '@island.is/island-ui/theme'
import React, { useEffect } from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { Navigation, Options } from 'react-native-navigation'
import { useNavigation } from 'react-native-navigation-hooks/dist'
import {
  ThemeProvider as StyledThemeProvider,
  useTheme,
} from 'styled-components'
import {
  AppearanceMode,
  usePreferencesStore,
} from '../stores/preferences-store'
import { getDefaultOptions } from '../utils/get-default-options'
import { overrideUserInterfaceStyle } from '../utils/rn-island'

export const shades = {
  light: {
    background: '#FFFFFF',
    foreground: '#00003C',
    shade700: '#8A8A8A',
    shade600: '#BFC1C0',
    shade500: '#CCCCD8',
    shade400: '#E4E3E2',
    shade300: '#EBEBEB',
    shade200: '#F2F2F5',
    shade100: '#FBFBFB',
  },
  dark: {
    background: '#000000',
    foreground: '#F2F2F5',
    shade700: '#6E6E6E',
    shade600: '#4F4F50',
    shade500: '#434444',
    shade400: '#373737',
    shade300: '#2E2E2E',
    shade200: '#222222',
    shade100: '#141414',
  },
}

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

export function getThemeWithPreferences(
  { appearanceMode }: { appearanceMode: AppearanceMode },
  scheme?: any,
) {
  // get color scheme from system if "automatic"
  const colorScheme =
    appearanceMode === 'automatic'
      ? Appearance.getColorScheme()
      : appearanceMode
  // find correct shades key ("light" | "dark")
  const shadesKey = typeof colorScheme === 'string' ? colorScheme : 'light'

  return {
    ...theme,
    isDark: colorScheme !== 'light',
    colorScheme: shadesKey,
    shade: shades[shadesKey],
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme()
  const preferences = usePreferencesStore()
  const selectedTheme = getThemeWithPreferences(preferences, scheme)

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
