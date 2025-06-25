import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { BASE_PATH } from '../lib/routes'
import { isMockMode } from '../mocks'
import { Router } from '../components/Router/Router'
import { environment } from '../environments'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { formSystemScopes } from '@island.is/auth/scopes'

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

