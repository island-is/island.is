import React from 'react'
import ReactDOM from 'react-dom'
// import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import * as styles from './main.treat'
import Header from './shared-components/Header/Header'
import { StepTwo, StepOne } from './routes/CreateDetentionRequest'
import { DetentionRequests } from './routes/DetentionRequests'
import { Overview } from './routes/Overview'
import { Login } from './routes/Login'
import * as Constants from './utils/constants'

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
        <Route path={Constants.STEP_THREE_ROUTE}>
          <Overview />
        </Route>
        <Route path={Constants.STEP_TWO_ROUTE}>
          <StepTwo />
        </Route>
        <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
          <StepOne />
        </Route>
        <Route path={Constants.STEP_ONE_ROUTE}>
          <StepOne />
        </Route>
        <Route path={Constants.DETENTION_REQUESTS_ROUTE}>
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
