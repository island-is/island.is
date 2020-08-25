import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Login } from './routes/Login'
import { Header } from './shared-components/Header'

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
)
