import {theme} from '@ui';
import {Appearance, ColorSchemeName} from 'react-native';
import {AppearanceMode, ThemeMode} from '../stores/preferences-store';

export const themes = {
  light: {
    isDark: false,
    shade: {
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
  efficient: {
    isDark: true,
    shade: {
      background: '#000000',
      foreground: '#00ff00',
      shade700: '#00b300',
      shade600: '#009900',
      shade500: '#008000',
      shade400: '#006600',
      shade300: '#004c00',
      shade200: '#003300',
      shade100: '#001900',
    },
  },
};

const defaultTheme = 'light';

export function getThemeWithPreferences(
  {appearanceMode}: {appearanceMode: AppearanceMode},
  systemScheme: ColorSchemeName = Appearance.getColorScheme() ?? defaultTheme,
) {
  // get color scheme from system if "automatic"
  // otherwise from appearanceMode
  const colorScheme = (
    appearanceMode === 'automatic' ? systemScheme : appearanceMode
  ) as ThemeMode;

  // find correct shades key
  const themeKey =
    typeof colorScheme === 'string' && themes[colorScheme]
      ? colorScheme
      : defaultTheme;

  const themeObj = {
    ...theme,
  };

  const shades = {
    dark: themes.dark.shade,
    light: themes.light.shade,
    efficient: themes.efficient.shade,
  };

  if (themeKey === 'efficient') {
    shades.dark = shades.efficient;
    themeObj.color = {
      ...themeObj.color,
      blue400: shades.dark.foreground as any,
    };
  }

  return {
    colorScheme: themeKey,
    ...themeObj,
    ...themes[themeKey],
    shades,
  };
}
