import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { makeServer } from 'apps/service-portal/mirage-server'
import { Login } from '../screens/login/login'
import { StateProvider } from '../stateProvider'
import { ApolloProvider } from '@apollo/react-hooks'
import * as store from '../store'
import Authenticator from '../components/Authenticator/Authenticator'
import Header from '../components/Header/Header'
import { createApolloClient } from '../graphql/client'

export const App = () => {
  makeServer()
  return (
    <Router>
      <ApolloProvider client={createApolloClient()}>
        <StateProvider
          initialState={store.initialState}
          reducer={store.reducer}
        >
          <Switch>
            <Route path="/innskraning">
              <Login />
            </Route>
            <Authenticator>
              <Header />
              <div>Logged in</div>
            </Authenticator>
          </Switch>
        </StateProvider>
      </ApolloProvider>
    </Router>
  )
}

export default App
