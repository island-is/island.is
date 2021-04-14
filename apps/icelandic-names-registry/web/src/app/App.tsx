import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from '../graphql/client'
import Authenticator from '../components/Authenticator/Authenticator'
import { StateProvider } from '../store/stateProvider'
import Layout from '../components/Layout/Layout'
import OidcSignIn from '../components/Authenticator/OidcSignIn'
import OidcSilentSignIn from '../components/Authenticator/OidcSilentSignIn'
import NamesEditor from '../components/NamesEditor/NamesEditor'
import { Paths } from '../constants'

import * as store from '../store/store'
import * as styles from './App.treat'

export const App = () => {
  return (
    <div className={styles.page}>
      <ApolloProvider client={client}>
        <StateProvider
          initialState={store.initialState}
          reducer={store.reducer}
        >
          <Router basename="/minarsidur">
            <Switch>
              <Route exact path={Paths.SignInOidc} component={OidcSignIn} />
              <Route
                exact
                path={Paths.SilentSignInOidc}
                component={OidcSilentSignIn}
              />
              <Route>
                <Authenticator>
                  <Layout>
                    <Switch>
                      <Route exact path={Paths.Root}>
                        <NamesEditor />
                      </Route>
                    </Switch>
                  </Layout>
                </Authenticator>
              </Route>
            </Switch>
          </Router>
        </StateProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
