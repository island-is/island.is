import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/service-portal/graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { ServicePortalPaths } from '@island.is/service-portal/core'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import {
  ApplicationErrorBoundary,
  PortalRouter,
  isMockMode,
} from '@island.is/portals/core'
import { modules } from '../lib/modules'
import { createRoutes } from '../lib/routes'
import { environment } from '../environments'
import * as styles from './App.css'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { servicePortalScopes } from '@island.is/auth/scopes'

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
          applicationBasePath={ServicePortalPaths.Base}
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
