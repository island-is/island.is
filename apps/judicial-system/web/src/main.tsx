import React from 'react'
import ReactDOM from 'react-dom'

import App from './shared-components/App/App'
// import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'

// Sentry.init({
//   dsn:
//     'https://0e96d7d759684a79a3d90b7cb5999066@o406638.ingest.sentry.io/5415125',
//   integrations: [new Integrations.BrowserTracing()],
//   tracesSampleRate: 1.0,
// })

ReactDOM.render(<App />, document.getElementById('root'))
