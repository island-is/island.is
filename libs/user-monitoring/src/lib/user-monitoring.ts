import { datadogRum } from '@datadog/browser-rum'

import { maskNationalId } from '@island.is/shared/pii'

interface DdRumInitParams {
  env: string
  version: string
  service: string
}

const initDdRum = (params: DdRumInitParams) => {
  datadogRum.init({
    applicationId: '665a387d-16c4-4c86-88c8-e059d8120021',
    clientToken: 'pub7a898a272110329d3a2e73e09e263f5b',
    site: 'datadoghq.eu',
    service: params.service,
    env: params.env,
    version: params.version,
    sampleRate: 100,
    trackInteractions: true,
    allowedTracingOrigins: [
      'https://island.is',
      /https:\/\/.*\.island\.is/,
      /https:\/\/.*\.devland\.is/,
      /http:\/\/localhost:*/,
    ],
    beforeSend: (event) => {
      event.view.url = maskNationalId(event.view.url)
    },
  })
}

export const userMonitoring = { initDdRum }
