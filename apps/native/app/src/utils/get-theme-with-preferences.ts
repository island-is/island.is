import { theme } from '@island.is/island-ui/theme'
import { Appearance } from 'react-native'
import { AppearanceMode } from '../stores/preferences-store'

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

export function getThemeWithPreferences(
  { appearanceMode }: { appearanceMode: AppearanceMode },
  scheme?: 'light' | 'dark',
) {
  // get color scheme from system if "automatic"
  const colorScheme = scheme
    ? scheme
    : appearanceMode === 'automatic'
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
