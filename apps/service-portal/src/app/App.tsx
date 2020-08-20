import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries

import { makeServer } from '../../mirage-server'
import { StateProvider } from '../store/stateProvider'
import { ApolloProvider } from '@apollo/react-hooks'
import * as store from '../store/store'
import Authenticator from '../components/Authenticator/Authenticator'
import { client } from '../graphql'
import Dashboard from '../components/Dashboard/Dashboard'
import Layout from '../components/Layout/Layout'
import Modules from '../components/Modules/Modules'
import * as styles from './App.treat'
import './App.css'
import OidcSignIn from '../components/Authenticator/OidcSignIn'
import { Log } from 'oidc-client'
import OidcSilentSignIn from '../components/Authenticator/OidcSilentSignIn'

export const App = () => {
  makeServer()
  //Log.logger = console
  //Log.level = Log.DEBUG
  return (
    <div className={styles.page}>
      <Router>
        <ApolloProvider client={client}>
          <StateProvider
            initialState={store.initialState}
            reducer={store.reducer}
          >
            <Switch>
              <Route path="/signin-oidc">
                <OidcSignIn />
              </Route>
              <Route path="/silent/signin-oidc">
                <OidcSilentSignIn />
              </Route>
              <Authenticator>
                <Layout>
                  <Route exact path="/">
                    <Dashboard />
                  </Route>
                  <Modules />
                </Layout>
              </Authenticator>
            </Switch>
          </StateProvider>
        </ApolloProvider>
      </Router>
    </div>
  )
}

export default App
