import '@island.is/api/mocks'
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { configure } from '@island.is/auth/react'

import { environment } from './environments'
import App from './app/App'

configure({
  baseUrl: `${window.location.origin}/minarsidur`,
  redirectPath: '/signin-oidc',
  redirectPathSilent: '/silent/signin-oidc',
  authority: environment.identityServer.authority,
  client_id: 'island-is-1',
  scope: `openid profile api_resource.scope @island.is/applications:read`,
  post_logout_redirect_uri: `${window.location.origin}`,
})

Sentry.init({
  dsn: environment.sentry.dsn,
  integrations: [new Integrations.BrowserTracing()],
  environment: 'frontend',
  enabled: process?.env?.NODE_ENV !== 'development',
  tracesSampleRate: 0.01,
})

ReactDOM.render(<App />, document.getElementById('root'))
