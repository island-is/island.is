import { Appearance, ColorSchemeName } from 'react-native'
import { DefaultTheme } from 'styled-components'

import { AppearanceMode, ThemeMode } from '../stores/preferences-store'
import { theme } from '../ui'

export const themes = {
  light: {
    isDark: false,
  },
  dark: {
    isDark: true,
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

  // find correct theme key
  const themeKey =
    typeof colorScheme === 'string' && themes[colorScheme]
      ? colorScheme
      : defaultTheme

  return {
    colorScheme: themeKey,
    ...theme,
    ...themes[themeKey],
    tokens: theme.tokenModes[themeKey],
  }
}
