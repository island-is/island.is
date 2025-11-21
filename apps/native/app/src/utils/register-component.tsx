import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { ThemeProvider } from '../contexts/theme-provider'
import { NavigationProvider } from 'react-native-navigation-hooks'
import { I18nProvider } from '../contexts/i18n-provider'
import { FeatureFlagProvider } from '../contexts/feature-flag-provider'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../graphql/client'
import { OfflineHoc } from '../hoc/offline-hoc'

export function registerComponent<Props>(
  name: string,
  Component: React.ComponentType<Props>,
) {
  // const client = getApolloClient()
  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <ThemeProvider>
          <I18nProvider>
            <NavigationProvider value={{ componentId: props.componentId }}>
              <FeatureFlagProvider>
                {/* <ApolloProvider client={client}>
                  <OfflineHoc> */}
                <Component {...props} />
                {/* </OfflineHoc>
                </ApolloProvider> */}
              </FeatureFlagProvider>
            </NavigationProvider>
          </I18nProvider>
        </ThemeProvider>
      )
    },
    () => Component,
  )
}
