import '@island.is/api/mocks'
import React from 'react'
import ReactDOM from 'react-dom'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import './auth'
import { environment } from './environments'
import App from './app/App'
import { userMonitoring } from '@island.is/user-monitoring'

if (!isRunningOnEnvironment('local')) {
  userMonitoring.initDdRum({
    service: 'service-portal',
    applicationId: environment.DD_RUM_APPLICATION_ID,
    clientToken: environment.DD_RUM_CLIENT_TOKEN,
    env: environment.ENVIRONMENT || 'local',
    version: environment.APP_VERSION || 'local',
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
