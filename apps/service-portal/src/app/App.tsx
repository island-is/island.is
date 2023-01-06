import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
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
import { StateProvider } from '../store/stateProvider'
import * as store from '../store/store'
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
        <StateProvider
          initialState={store.initialState}
          reducer={store.reducer}
        >
          <LocaleProvider locale={defaultLanguage} messages={{}}>
            <ApplicationErrorBoundary>
              <Router basename={ServicePortalPaths.Base}>
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
              </Router>
            </ApplicationErrorBoundary>
          </LocaleProvider>
        </StateProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
