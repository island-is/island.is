import React from 'react'
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { Authenticator } from '@island.is/auth/react'
import { LocaleProvider } from '@island.is/localization'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { client } from '@island.is/service-portal/graphql'
import { defaultLanguage } from '@island.is/shared/constants'

import { GlobalModules } from '../components/GlobalModules/GlobalModules'
import Layout from '../components/Layout/Layout'
import { UserProfileLocale } from '../components/UserProfileLocale/UserProfileLocale'
import { environment } from '../environments'
import Dashboard from '../screens/Dashboard/Dashboard'
import Modules from '../screens/Modules/Modules'
import { StateProvider } from '../store/stateProvider'
import * as store from '../store/store'

import ApplicationErrorBoundary from './../components/ApplicationErrorBoundary/ApplicationErrorBoundary'

import * as styles from './App.css'

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
              <Router basename="/minarsidur">
                <Authenticator>
                  <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                    <UserProfileLocale />
                    <Layout>
                      <Switch>
                        <Route exact path={ServicePortalPath.MinarSidurRoot}>
                          <Dashboard />
                        </Route>
                        <Route>
                          <Modules />
                        </Route>
                      </Switch>
                      <GlobalModules />
                    </Layout>
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
