import { Options } from 'react-native-navigation'
import { getThemeWithPreferences } from './get-theme-with-preferences'
import { preferencesStore } from '../stores/preferences-store'

export function getDefaultOptions(
  theme = getThemeWithPreferences(preferencesStore.getState()),
): Options {
  // Set status bar style
  // StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')

  // if (Platform.OS === 'android') {
  //   StatusBar.setBackgroundColor(theme.color.blue400);
  // }

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
        color: theme.isDark ? theme.color.white : theme.color.blue400,
      },
      animate: true,
      borderHeight: 0,
      borderColor: 'transparent',
    },
    statusBar: {
      backgroundColor: theme.shade.background,
      animated: true,
      style: theme.isDark ? 'light' : 'dark',
      visible: true,
      hideWithTopBar: true,
    },
    window: {
      backgroundColor: '#222222',
    },
    layout: {
      backgroundColor: theme.isDark ? '#000000' : '#ffffff',
      componentBackgroundColor: theme.isDark ? '#000000' : '#ffffff',
    },
    bottomTabs: {
      animateTabSelection: false,
      barStyle: theme.isDark ? 'black' : 'default',
      elevation: 0,
      borderWidth: 0,
      hideShadow: true,
      titleDisplayMode: 'alwaysShow',
      backgroundColor: theme.isDark ? '#000000' : '#ffffff',
    },
    bottomTab: {
      fontSize: 11,
      textColor: theme.shade.foreground,
      selectedTextColor: theme.shade.foreground,
    },
  }
}
