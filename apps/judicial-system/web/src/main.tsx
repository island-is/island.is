import React from 'react'
import ReactDOM from 'react-dom'
// import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import * as styles from './main.treat'
import Header from './shared-components/Header/Header'
import { StepTwo, StepOne } from './routes/CreateDetentionRequest'
import { DetentionRequests } from './routes/DetentionRequests'
import { Login } from './routes/Login'
// Sentry.init({
//   dsn:
//     'https://0e96d7d759684a79a3d90b7cb5999066@o406638.ingest.sentry.io/5415125',
//   integrations: [new Integrations.BrowserTracing()],
//   tracesSampleRate: 1.0,
// })

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <main className={styles.mainConainer}>
      <Switch>
        <Route path="/stofna-krofu/lagaakvaedi">
          <StepTwo />
        </Route>
        <Route path="/stofna-krofu/grunnupplysingar">
          <StepOne />
        </Route>
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
