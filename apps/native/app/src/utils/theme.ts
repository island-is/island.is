import { theme as islandUiTheme } from '@island.is/island-ui/theme';
import { NavigationFunctionComponent, Options } from 'react-native-navigation';
import { DefaultTheme } from 'styled-components/native';
import { AppearanceMode, preferencesStore } from '../stores/preferences-store';
import { getThemeWithPreferences } from './get-theme-with-preferences';

export const theme = {
  ...islandUiTheme,
};

type setWithThemeCallback = (theme: DefaultTheme) => Options

export const setWithTheme = (
  screen: NavigationFunctionComponent,
  callback: setWithThemeCallback,
) => {
  const options = {}
  preferencesStore.subscribe(
    (appearanceMode: AppearanceMode) => {
      const theme = getThemeWithPreferences({ appearanceMode })
      Object.assign(options, callback(theme))
    },
    (s) => s.appearanceMode,
  )
  screen.options = options
}
