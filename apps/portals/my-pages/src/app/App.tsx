import { ApolloProvider } from '@apollo/client'
import { servicePortalScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import {
  ApplicationErrorBoundary,
  PortalRouter,
  isMockMode,
} from '@island.is/portals/core'
import { ServicePortalPaths } from '@island.is/portals/my-pages/core'
import { client } from '@island.is/portals/my-pages/graphql'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
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
