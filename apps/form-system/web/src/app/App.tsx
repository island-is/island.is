import { ApolloProvider } from '@apollo/client'
import { formSystemScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'
import { Router } from '../components/Router/Router'
import { environment } from '../environments'
import { BASE_PATH } from '../lib/routes'
import { isMockMode } from '../mocks'
import { client } from './client'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: formSystemScopes,
    })
  : undefined

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <BffProvider
        applicationBasePath={BASE_PATH}
        mockedInitialState={mockedInitialState}
      >
        <ApplicationErrorBoundary>
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <Router />
          </FeatureFlagProvider>
        </ApplicationErrorBoundary>
      </BffProvider>
    </LocaleProvider>
  </ApolloProvider>
)
