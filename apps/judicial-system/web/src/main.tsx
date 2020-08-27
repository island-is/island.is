import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Login } from './routes/Login'
import { Header } from './shared-components/Header'

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <main>
      <Switch>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </main>
  </BrowserRouter>,
  document.getElementById('root'),
)
