import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Authenticator } from '@island.is/auth/react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/service-portal/graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import {
  ApplicationErrorBoundary,
  PortalProvider,
  Modules,
} from '@island.is/portals/core'

import { environment } from '../environments'
import Dashboard from '../screens/Dashboard/Dashboard'
import Layout from '../components/Layout/Layout'
import { UserProfileLocale } from '@island.is/shared/components'
import * as styles from './App.css'
import { modules } from '../lib/modules'
import { ServicePortalPaths } from '../lib/paths'

export const App = () => {
  return (
    <div className={styles.page}>
      <ApolloProvider client={client}>
        <LocaleProvider locale={defaultLanguage} messages={{}}>
          <ApplicationErrorBoundary>
            <BrowserRouter basename={ServicePortalPaths.Base}>
              <Authenticator>
                <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                  <PortalProvider
                    modules={modules}
                    meta={{
                      basePath: ServicePortalPaths.Base,
                      portalType: 'my-pages',
                    }}
                  >
                    <UserProfileLocale />
                    <Layout>
                      <Routes>
                        <Route
                          index
                          path={ServicePortalPaths.Root}
                          element={<Dashboard />}
                        />
                        <Route path="*" element={<Modules />} />
                      </Routes>
                    </Layout>
                  </PortalProvider>
                </FeatureFlagProvider>
              </Authenticator>
            </BrowserRouter>
          </ApplicationErrorBoundary>
        </LocaleProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
