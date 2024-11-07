import { ApolloProvider } from '@apollo/client'
import { servicePortalScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import {
  ApplicationErrorBoundary,
  PortalRouter,
  isMockMode,
} from '@island.is/portals/core'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { ServicePortalPaths } from '@island.is/service-portal/core'
import { client } from '@island.is/service-portal/graphql'
import { defaultLanguage } from '@island.is/shared/constants'
import { environment } from '../environments'
import { modules } from '../lib/modules'
import { createRoutes } from '../lib/routes'
import * as styles from './App.css'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: servicePortalScopes,
    })
  : undefined

export const App = () => (
  <div className={styles.page}>
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <BffProvider
          options={{
            applicationBasePath: ServicePortalPaths.Base,
            authority: environment.identityServer.authority,
          }}
          mockedInitialState={mockedInitialState}
        >
          <ApplicationErrorBoundary>
            <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
              <PortalRouter
                modules={modules}
                createRoutes={createRoutes}
                portalMeta={{
                  basePath: ServicePortalPaths.Base,
                  portalType: 'my-pages',
                  portalTitle: 'Mínar síður - Ísland.is',
                }}
              />
            </FeatureFlagProvider>
          </ApplicationErrorBoundary>
        </BffProvider>
      </LocaleProvider>
    </ApolloProvider>
  </div>
)
