import { Appearance, StatusBar } from 'react-native'
import { Options } from 'react-native-navigation'
import { getThemeWithPreferences } from '../contexts/theme-provider'
import { preferencesStore } from '../stores/preferences-store'

export function getDefaultOptions(): Options {
  const theme = getThemeWithPreferences(preferencesStore.getState())

  // Set status bar style
  StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')

  return {
    topBar: {
      background: theme.isDark
        ? {
            translucent: true,
            color: null as any,
          }
        : {
            translucent: false,
            color: '#ffffff',
          },
      barStyle: theme.isDark ? 'black' : 'default',
      backButton: {
        color: theme.color.blue400,
      },
      elevation: 0,
      title: {
        fontFamily: 'IBMPlexSans-SemiBold',
        fontSize: 19,
        color: theme.color.blue400,
      },
      animate: true,
      borderHeight: 0,
      borderColor: 'transparent',
    },
    window: {
      backgroundColor: theme.isDark ? '#000000' : '#ffffff',
    },
    layout: {
      backgroundColor: theme.isDark ? '#000000' : '#ffffff',
      componentBackgroundColor: theme.isDark ? '#000000' : '#ffffff',
    },
    bottomTabs: {
      elevation: 0,
      borderWidth: 0,
      hideShadow: true,
      titleDisplayMode: 'alwaysHide',
      translucent: theme.isDark ? true : false,
      backgroundColor: theme.isDark ? (null as any) : '#ffffff',
    },
  }
}
