import { Appearance, ColorSchemeName } from 'react-native'
import { DefaultTheme } from 'styled-components'

import { AppearanceMode, ThemeMode } from '../stores/preferences-store'
import { theme } from '../ui'

export const themes = {
  light: {
    isDark: false,
    shade: theme.shade,
  },
  dark: {
    isDark: true,
    shade: {
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
  },
}

const defaultTheme = 'light'

export function getThemeWithPreferences(
  { appearanceMode }: { appearanceMode: AppearanceMode },
  systemScheme: ColorSchemeName = Appearance.getColorScheme() ?? defaultTheme,
): DefaultTheme {
  // get color scheme from system if "automatic"
  // otherwise from appearanceMode
  const colorScheme = (
    appearanceMode === 'automatic' ? systemScheme : appearanceMode
  ) as ThemeMode

  // find correct shades key
  const themeKey =
    typeof colorScheme === 'string' && themes[colorScheme]
      ? colorScheme
      : defaultTheme

  const themeObj = {
    ...theme,
  }

  const shades = {
    dark: themes.dark.shade,
    light: themes.light.shade,
  }

  return {
    colorScheme: themeKey,
    ...themeObj,
    ...themes[themeKey],
    shades,
    tokens: theme.tokenModes[themeKey],
  }
}
