import { Options } from 'react-native-navigation'
import { preferencesStore } from '../stores/preferences-store'
import { isAndroid } from './devices'
import { getThemeWithPreferences } from './get-theme-with-preferences'

export function getDefaultOptions(
  theme = getThemeWithPreferences(preferencesStore.getState()),
): Options {
  return {
    topBar: {
      background: isAndroid
        ? {
            color: theme.shade.background,
          }
        : {},
      backButton: {
        color: theme.color.blue400,
      },
      elevation: 0,
      title: {
        fontFamily: 'IBMPlexSans-SemiBold',
        fontSize: 19,
        color: theme.shade.foreground,
      },
      largeTitle: {
        fontFamily: 'IBMPlexSans-SemiBold',
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
      },
      noBorder: true,
      animateRightButtons: false,
      animateLeftButtons: false,
      borderHeight: 0,
      borderColor: 'transparent',
    },
    navigationBar: {
      backgroundColor: theme.shade.background,
      visible: true,
    },
    statusBar: isAndroid
      ? {
          animate: true,
          backgroundColor: theme.shade.background,
          style: theme.isDark ? 'light' : 'dark',
        }
      : undefined,
    window: {
      backgroundColor: isAndroid
        ? theme.shade.background
        : {
            dark: theme.shades.dark.background,
            light: theme.shades.light.background,
          },
    },
    layout: isAndroid
      ? {
          backgroundColor: theme.shade.background,
          componentBackgroundColor: theme.shade.background,
          fitSystemWindows: true,
          topMargin: 0,
        }
      : {},
    bottomTabs: {
      animateTabSelection: false,
      elevation: 0,
      borderWidth: isAndroid ? 0 : undefined,
      hideShadow: true,
      titleDisplayMode: 'alwaysShow',
      ...(isAndroid
        ? {
            backgroundColor: theme.shade.background,
          }
        : {}),
    },
  }
}
