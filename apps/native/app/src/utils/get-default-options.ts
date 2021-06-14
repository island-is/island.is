import { DynamicColorIOS, Platform } from 'react-native'
import { Options } from 'react-native-navigation'
import { preferencesStore } from '../stores/preferences-store'
import { getThemeWithPreferences } from './get-theme-with-preferences'

export function getDefaultOptions(
  theme = getThemeWithPreferences(preferencesStore.getState()),
): Options {
  return {
    topBar: {
      background:
        Platform.OS === 'android'
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
      },
      noBorder: true,
      animate: true,
      borderHeight: 0,
      borderColor: 'transparent',
    },
    statusBar: Platform.OS === 'android' ? {
      animated: true,
      backgroundColor: theme.shade.background,
      style: theme.isDark ? 'light' : 'dark',
    } : undefined,
    window: {
      backgroundColor:
        Platform.OS === 'android'
          ? theme.shade.background
          : DynamicColorIOS({
              dark: theme.shades.dark.background,
              light: theme.shades.light.background,
            }),
    },
    layout:
      Platform.OS === 'android'
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
      borderWidth: 0,
      hideShadow: true,
      titleDisplayMode: 'alwaysShow',
      ...(Platform.OS === 'android'
        ? {
            backgroundColor: theme.shade.background,
          }
        : {}),
    },
  }
}
