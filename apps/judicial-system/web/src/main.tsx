import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'

import AuthContext from './utils/authContext'
import { Header } from './shared-components/Header'
import { Login } from './routes/Login'
import { CreateDetentionRequest } from './routes/CreateDetentionRequest'
import { DetentionRequests } from './routes/DetentionRequests'

import * as styles from './main.treat'
import { getCookie } from './utils/cookies'

// Sentry.init({
//   dsn:
//     'https://0e96d7d759684a79a3d90b7cb5999066@o406638.ingest.sentry.io/5415125',
//   integrations: [new Integrations.BrowserTracing()],
//   tracesSampleRate: 1.0,
// })
const cookie = getCookie('judicial-system.token')
console.log(document.cookie)

ReactDOM.render(
  <BrowserRouter>
    <AuthContext.Provider
      value={{ authenticated: false, user: {}, accessToken: 'sdfsdf' }}
    >
      <Header />
      <main className={styles.mainConainer}>
        <Switch>
          <Route path="/stofna-krofu">
            <CreateDetentionRequest />
          </Route>
          <Route path="/gaesluvardhaldskrofur">
            <DetentionRequests />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </main>
    </AuthContext.Provider>
  </BrowserRouter>,
  document.getElementById('root'),
)
