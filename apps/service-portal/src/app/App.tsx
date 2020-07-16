import React, { useEffect, useState, FC, Suspense } from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { makeServer } from 'apps/service-portal/mirage-server'
import { Login } from '../screens/login/login'
import { StateProvider, useStateValue } from '../stateProvider'
import { ApolloProvider } from '@apollo/react-hooks'
import * as store from '../store'
import Authenticator from '../components/Authenticator/Authenticator'
import Header from '../components/Header/Header'
import { createApolloClient } from '../graphql/client'
import {
  Columns,
  Column,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'
import { ServicePortalModule } from '@island.is/service-portal/core'

const ModuleLoader: FC<{ module: ServicePortalModule }> = ({ module }) => {
  const [App, setApp] = useState<any>()

  useEffect(() => {
    async function fetchWidgets() {
      const app = await module.render()
      setApp(app)
    }

    fetchWidgets()
  }, [module])

  if (App)
    return (
      <Suspense fallback={<SkeletonLoader />}>
        <App />
      </Suspense>
    )
  return null
}

const Modules = () => {
  const [{ modules }] = useStateValue()
  return (
    <>
      <Route
        path="/umsoknir"
        render={() => <ModuleLoader module={modules.applicationsModule} />}
      />
    </>
  )
}

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
              <ContentBlock>
                <Columns>
                  <Column width="3/12">
                    <Sidebar />
                  </Column>
                  <Column width="9/12">
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
