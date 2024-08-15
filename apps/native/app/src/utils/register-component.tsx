import { ApolloProvider } from '@apollo/client'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { NavigationProvider } from 'react-native-navigation-hooks'
import { FeatureFlagProvider } from '../contexts/feature-flag-provider'
import { I18nProvider } from '../contexts/i18n-provider'
import { ThemeProvider } from '../contexts/theme-provider'
import { getApolloClient } from '../graphql/client'
import { OfflineHoc } from '../hoc/offline-hoc'

export function registerComponent<Props>(
  name: string,
  Component: NavigationFunctionComponent<Props>,
) {
  const client = getApolloClient()

  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <ThemeProvider>
          <I18nProvider>
            <NavigationProvider value={{ componentId: props.componentId }}>
              <FeatureFlagProvider>
                <ApolloProvider client={client}>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <OfflineHoc>
                      <Component {...props} />
                    </OfflineHoc>
                  </GestureHandlerRootView>
                </ApolloProvider>
              </FeatureFlagProvider>
            </NavigationProvider>
          </I18nProvider>
        </ThemeProvider>
      )
    },
    () => Component,
  )
}
