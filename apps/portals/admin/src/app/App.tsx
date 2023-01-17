import { BrowserRouter } from 'react-router-dom'
import { CompatRouter, Routes, Route } from 'react-router-dom-v5-compat'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { Modules, PortalProvider } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import environment from '../environments/environment'
import { Layout } from '../components/Layout/Layout'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { AdminPortalPaths } from '../lib/paths'
import { Dashboard } from '../screens/Dashboard/Dashboard'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <ApplicationErrorBoundary>
          <BrowserRouter basename={AdminPortalPaths.Base}>
            <CompatRouter>
              <Authenticator>
                <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                  <PortalProvider
                    modules={modules}
                    meta={{
                      basePath: AdminPortalPaths.Base,
                      portalType: 'admin',
                    }}
                  >
                    <Layout>
                      <Routes>
                        <Route
                          index
                          path={AdminPortalPaths.Root}
                          element={<Dashboard />}
                        />
                        <Route path="*" element={<Modules />} />
                      </Routes>
                    </Layout>
                  </PortalProvider>
                </FeatureFlagProvider>
              </Authenticator>
            </CompatRouter>
          </BrowserRouter>
        </ApplicationErrorBoundary>
      </LocaleProvider>
    </ApolloProvider>
  )
}
