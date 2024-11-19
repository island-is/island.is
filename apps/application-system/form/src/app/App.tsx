import { ApolloProvider } from '@apollo/client'

import { client } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'

import { applicationSystemScopes } from '@island.is/auth/scopes'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { Router } from '../components/Router'
import { environment } from '../environments'
import { BASE_PATH } from '../lib/routes'
import { isMockMode } from '../mocks'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: applicationSystemScopes,
    })
  : undefined

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <BffProvider
        applicationBasePath={BASE_PATH}
        mockedInitialState={mockedInitialState}
      >
        <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
          <Router />
        </FeatureFlagProvider>
      </BffProvider>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
