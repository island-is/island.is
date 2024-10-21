import { setupMocking } from '@island.is/portals/core'

import { userMonitoring } from '@island.is/user-monitoring'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import environment from './environments/environment'
import { App } from './app/App'

setupMocking()

if (!isRunningOnEnvironment('local')) {
  userMonitoring.initDdRum({
    service: 'admin-portal',
    applicationId: environment.DD_RUM_APPLICATION_ID,
    clientToken: environment.DD_RUM_CLIENT_TOKEN,
    env: environment.ENVIRONMENT,
    version: environment.APP_VERSION,
  })
}

const rootEl = document.getElementById('root')

if (!rootEl) {
  throw new Error('Root element not found')
}

const root = createRoot(rootEl)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
