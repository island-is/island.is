import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { environment } from './environments'

import App from './app/App'

Sentry.init({
  dsn: environment.sentry.dsn,
  integrations: [new Integrations.BrowserTracing()],
  environment: 'frontend',
  tracesSampleRate: 1.0,
})

ReactDOM.render(<App />, document.getElementById('root'))
