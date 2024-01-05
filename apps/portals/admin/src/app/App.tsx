import { ApolloProvider } from '@apollo/client'
import { AuthProvider } from '@island.is/auth/react'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { ApplicationErrorBoundary, PortalRouter } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import { client } from '../graphql'
import environment from '../environments/environment'
import { AdminPortalPaths } from '../lib/paths'
import { createRoutes } from '../lib/routes'

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <ApplicationErrorBoundary>
        <AuthProvider basePath={AdminPortalPaths.Base}>
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <PortalRouter
              modules={modules}
              createRoutes={createRoutes}
              portalMeta={{
                portalType: 'admin',
                basePath: AdminPortalPaths.Base,
              }}
            />
          </FeatureFlagProvider>
        </AuthProvider>
      </ApplicationErrorBoundary>
    </LocaleProvider>
  </ApolloProvider>
)
