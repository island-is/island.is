import { ApolloProvider } from '@apollo/client'

import { initializeClient } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { AuthProvider } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'

import { environment } from '../environments'
import { BASE_PATH } from '../lib/routes'
import { Router } from '../components/Router'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <AuthProvider basePath={BASE_PATH}>
        <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
          <Router />
        </FeatureFlagProvider>
      </AuthProvider>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
