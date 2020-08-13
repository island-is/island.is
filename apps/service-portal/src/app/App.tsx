import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Log, User, UserManager } from 'oidc-client';
import { makeServer } from 'apps/service-portal/mirage-server'
import { Login } from '../screens/login/login'
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
import OidcSignIn from '../components/Authenticator/OidcSignIn';

export const App = () => {
  makeServer()
  const settings = {
    authority: 'https://siidentityserverweb20200805020732.azurewebsites.net/',
    client_id: 'island-is-1',
    redirect_uri: `http://localhost:4200/signin-oidc`,
    // tslint:disable-next-line:object-literal-sort-keys
    response_type: 'code',
    /* supported types
      "code",
      "token",
      "id_token",
      "id_token token",
      "code id_token",
      "code token",
      "code id_token token"
    */
    loadUserInfo: true,
    scope: 'openid profile offline_access'
  };

  /*
    authority (string): The URL of the OIDC/OAuth2 provider.
    client_id (string): Your client application's identifier as registered with the OIDC/OAuth2 provider.
    redirect_uri (string): The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider.
    response_type (string, default: 'id_token'): The type of response desired from the OIDC/OAuth2 provider.
    scope (string, default: 'openid'): The scope being requested from the OIDC/OAuth2 provider.*/
  //
  return (
    <div className={styles.page}>
      <Router>
        <ApolloProvider client={client}>
          <StateProvider
            initialState={store.initialState}
            reducer={store.reducer}
          >
            <Switch>
              <Route path="/innskraning">
                <Login />
              </Route>
              <Route path="/signin-oidc">
                <OidcSignIn userManager={new UserManager(settings)} />
              </Route>
              <Authenticator userManager={new UserManager(settings)}>
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
