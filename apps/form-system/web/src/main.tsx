import '@island.is/api/mocks'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { userMonitoring } from '@island.is/user-monitoring'
import { environment } from './environments'
import { App } from './app/App'

if (!isRunningOnEnvironment('local')) {
  userMonitoring.initDdLogs({
    service: 'form-system-web',
    clientToken: environment.DD_LOGS_CLIENT_TOKEN,
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
