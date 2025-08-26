import { datadogLogs } from '@datadog/browser-logs'

import { maskNationalId } from '@island.is/shared/pii'

interface DdLogsInitParams {
  clientToken: string
  env: string
  version: string
  service: string
}

const initDdLogs = (params: DdLogsInitParams) => {
  datadogLogs.init({
    clientToken: params.clientToken,
    site: 'datadoghq.eu',
    service: params.service,
    env: params.env,
    version: params.version,
    forwardErrorsToLogs: true,
    beforeSend: (event) => {
      event.view.url = maskNationalId(event.view.url)
      return true
    },
  })
}

export const userMonitoring = { initDdLogs }
