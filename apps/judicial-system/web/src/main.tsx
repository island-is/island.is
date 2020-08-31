import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Login } from './routes/Login'
import { DetentionRequests } from './routes/DetentionRequests'
import { Header } from './shared-components/Header'
import * as styles from './main.treat'

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <main className={styles.mainConainer}>
      <Switch>
        <Route path="/gaesluvardhaldskrofur">
          <DetentionRequests />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </main>
  </BrowserRouter>,
  document.getElementById('root'),
)
