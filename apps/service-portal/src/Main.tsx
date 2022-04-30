import { userMonitoring } from '@island.is/user-monitoring'
import '@island.is/api/mocks'
import React from 'react'
import ReactDOM from 'react-dom'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

import './auth'
import { environment } from './environments'
import App from './app/App'

console.debug(`Checking if we should init DD RUM`)
if (!isRunningOnEnvironment('local')) {
  console.debug(`About to init DD RUM`)
  const params = {
    service: 'service-portal',
    applicationId: environment.DD_RUM_APPLICATION_ID,
    clientToken: environment.DD_RUM_CLIENT_TOKEN,
    env: environment.ENVIRONMENT,
    version: environment.APP_VERSION,
  }
  userMonitoring.initDdRum(params)
  console.log(`params: ${JSON.stringify(params)}`)
  console.debug('done with the RUM')
}
console.debug(`About to render the DOM`)

ReactDOM.render(<App />, document.getElementById('root'))
