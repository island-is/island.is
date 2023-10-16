import { AuthProvider } from '@island.is/auth/react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/service-portal/graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { ApplicationErrorBoundary, PortalRouter } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import { createRoutes } from '../lib/routes'
import { ServicePortalPaths } from '../lib/paths'
import { environment } from '../environments'
import * as styles from './App.css'

// DEPLOYME
export const App = () => (
  <div className={styles.page}>
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <AuthProvider basePath={ServicePortalPaths.Base}>
          <ApplicationErrorBoundary>
            <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
              <PortalRouter
                modules={modules}
                createRoutes={createRoutes}
                portalMeta={{
                  basePath: ServicePortalPaths.Base,
                  portalType: 'my-pages',
                }}
              />
            </FeatureFlagProvider>
          </ApplicationErrorBoundary>
        </AuthProvider>
      </LocaleProvider>
    </ApolloProvider>
  </div>
)
