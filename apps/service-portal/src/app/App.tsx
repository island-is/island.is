import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { CompatRouter } from 'react-router-dom-v5-compat'
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
              <CompatRouter>
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
                        <Switch>
                          <Route exact path={ServicePortalPaths.Root}>
                            <Dashboard />
                          </Route>
                          <Route>
                            <Modules />
                          </Route>
                        </Switch>
                      </Layout>
                    </PortalProvider>
                  </FeatureFlagProvider>
                </Authenticator>
              </CompatRouter>
            </Router>
          </ApplicationErrorBoundary>
        </LocaleProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
