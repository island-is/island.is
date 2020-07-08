import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { makeServer } from 'apps/service-portal/mirage-server'
import { Login } from '../screens/login/login'
import { StateProvider } from '../stateProvider'
import * as store from '../store'
import Authenticator from '../components/authenticator/authenticator'
import Header from '../components/header/header'

export const App = () => {
  makeServer()
  return (
    <Router>
      <StateProvider initialState={store.initialState} reducer={store.reducer}>
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
    </Router>
  )
}

export default App
