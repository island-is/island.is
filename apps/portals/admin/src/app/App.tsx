import { ApolloProvider } from '@apollo/client'
import { adminPortalScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import {
  ApplicationErrorBoundary,
  PortalRouter,
  isMockMode,
} from '@island.is/portals/core'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'
import environment from '../environments/environment'
import { client } from '../graphql'
import { modules } from '../lib/modules'
import { AdminPortalPaths } from '../lib/paths'
import { createRoutes } from '../lib/routes'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: adminPortalScopes,
    })
  : undefined

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <ApplicationErrorBoundary>
        <BffProvider
          applicationBasePath={AdminPortalPaths.Base}
          mockedInitialState={mockedInitialState}
        >
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <PortalRouter
              modules={modules}
              createRoutes={createRoutes}
              portalMeta={{
                portalType: 'admin',
                basePath: AdminPortalPaths.Base,
                portalTitle: 'Stjórnborð - Ísland.is',
              }}
            />
          </FeatureFlagProvider>
        </BffProvider>
      </ApplicationErrorBoundary>
    </LocaleProvider>
  </ApolloProvider>
)
