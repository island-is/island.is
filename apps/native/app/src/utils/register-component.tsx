import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {NavigationProvider} from 'react-native-navigation-hooks';
import {FeatureFlagProvider} from '../contexts/feature-flag-provider';
import {I18nProvider} from '../contexts/i18n-provider';
import {ThemeProvider} from '../contexts/theme-provider';

export function registerComponent(
  name: string,
  Component: NavigationFunctionComponent<any>,
) {
  Navigation.registerComponent(
    name,
    () => props => {
      return (
        <ThemeProvider>
          <I18nProvider>
            <NavigationProvider value={{componentId: props.componentId}}>
              <FeatureFlagProvider>
                <Component {...props} />
              </FeatureFlagProvider>
            </NavigationProvider>
          </I18nProvider>
        </ThemeProvider>
      );
    },
    () => Component,
  );
}
