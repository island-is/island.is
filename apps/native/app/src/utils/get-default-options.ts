import { StatusBar } from 'react-native'
import { Platform } from 'react-native'
import { Options } from 'react-native-navigation'
import { preferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'
import { getThemeWithPreferences } from './get-theme-with-preferences'

export function getDefaultOptions(
  theme = getThemeWithPreferences(preferencesStore.getState()),
): Options {
  // const initialized = uiStore.getState().initializedApp
  return {
    topBar: {
      background: theme.isDark
        ? {
            translucent: false,
            color: '#000000',
          }
        : {
            translucent: false,
            color: '#ffffff',
          },
      barStyle: theme.isDark ? ('black' as any) : 'default',
      backButton: {
        color: theme.color.blue400,
      },
      elevation: 4,
      title: {
        fontFamily: 'IBMPlexSans-SemiBold',
        fontSize: 19,
      },
      noBorder: true,
      animate: true,
      borderHeight: 0,
      borderColor: 'transparent',
      rightButtonColor: theme.color.blue400,
    },
    statusBar: {
      animated: true,
      style: theme.isDark ? 'light' : 'dark',
      backgroundColor: theme.shade.background,
    },
    window: {
      backgroundColor: '#222222',
    },
    layout: {
      backgroundColor: theme.shade.background,
      componentBackgroundColor: theme.shade.background,
    },
    bottomTabs: {
      animateTabSelection: false,
      barStyle: theme.isDark ? 'black' : 'default',
      elevation: 0,
      borderWidth: 0,
      hideShadow: true,
      titleDisplayMode: 'alwaysShow',
      backgroundColor: theme.shade.background,
    },
  }
}
