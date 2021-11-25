import '@island.is/api/mocks'
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import {
  getActiveEnvironment,
  isRunningOnEnvironment,
} from '@island.is/shared/utils'

import './auth'

import { environment } from './environments'
import App from './app/App'

const activeEnvironment = getActiveEnvironment()

Sentry.init({
  dsn: environment.sentry.dsn,
  integrations: [new Integrations.BrowserTracing()],
  enabled: !isRunningOnEnvironment('local'),
  environment: activeEnvironment,
  tracesSampleRate: 0.01,
})

ReactDOM.render(<App />, document.getElementById('root'))
