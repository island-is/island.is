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
import { userMonitoring } from '@island.is/user-monitoring'

const activeEnvironment = getActiveEnvironment()

if (!isRunningOnEnvironment('local')) {
  userMonitoring.initDdRum({
    service: 'application-system-form',
    applicationId: environment.DD_RUM_APPLICATION_ID,
    clientToken: environment.DD_RUM_CLIENT_TOKEN,
    env: environment.ENVIRONMENT,
    version: environment.APP_VERSION,
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
