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
import { client } from '../graphql/'
import { Columns, Column, ContentBlock } from '@island.is/island-ui/core'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'
import Modules from '../components/Modules/Modules'
import ContentBreadcrumbs from '../components/ContentBreadcrumbs/ContentBreadcrumbs'
import './App.css'

export const App = () => {
  makeServer()

  return (
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
            <Authenticator>
              <Header />
              <ContentBlock>
                <Columns>
                  <Column width="3/12">
                    <Sidebar />
                  </Column>
                  <Column width="9/12">
                    <ContentBreadcrumbs />
                    <Route exact path="/">
                      <Dashboard />
                    </Route>
                    <Modules />
                  </Column>
                </Columns>
              </ContentBlock>
            </Authenticator>
          </Switch>
        </StateProvider>
      </ApolloProvider>
    </Router>
  )
}

export default App
