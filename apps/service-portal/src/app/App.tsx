import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { StateProvider } from '../store/stateProvider'
import { ApolloProvider } from '@apollo/client'
import * as store from '../store/store'
import Authenticator from '../components/Authenticator/Authenticator'
import { client } from '@island.is/service-portal/graphql'
import Dashboard from '../screens/Dashboard/Dashboard'
import Layout from '../components/Layout/Layout'
import Modules from '../screens/Modules/Modules'
import * as styles from './App.treat'
import OidcSignIn from '../components/Authenticator/OidcSignIn'
import OidcSilentSignIn from '../components/Authenticator/OidcSilentSignIn'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { defaultLanguage, LocaleProvider } from '@island.is/localization'
import './App.css'
import { GlobalModules } from '../components/GlobalModules/GlobalModules'
import { UserProfileLocale } from '../components/UserProfileLocale/UserProfileLocale'

export const App = () => {
  return (
    <div className={styles.page}>
      <ApolloProvider client={client}>
        <StateProvider
          initialState={store.initialState}
          reducer={store.reducer}
        >
          <LocaleProvider locale={defaultLanguage} messages={{}}>
            <div>
              <UserProfileLocale />
              <Router>
                <Switch>
                  <Route
                    exact
                    path={ServicePortalPath.MinarSidurSignInOidc}
                    component={OidcSignIn}
                  />
                  <Route
                    exact
                    path={ServicePortalPath.MinarSidurSilentSignInOidc}
                    component={OidcSilentSignIn}
                  />
                  <Route>
                    <Authenticator>
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
                    </Authenticator>
                  </Route>
                </Switch>
              </Router>
            </div>
          </LocaleProvider>
        </StateProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
