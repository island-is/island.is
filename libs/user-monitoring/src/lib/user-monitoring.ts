import { datadogRum } from '@datadog/browser-rum'

import { maskNationalId } from '@island.is/shared/pii'

interface DdRumInitParams {
  applicationId: string
  clientToken: string
  env: string
  version: string
  service: string
}

const initDdRum = (params: DdRumInitParams) => {
  datadogRum.init({
    applicationId: params.applicationId,
    clientToken: params.clientToken,
    site: 'datadoghq.eu',
    service: params.service,
    env: params.env,
    version: params.version,
    sessionSampleRate: 10,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    enablePrivacyForActionName: true,
    defaultPrivacyLevel: 'mask',
    allowedTracingUrls: [
      'https://island.is',
      /https:\/\/.*\.island\.is/,
      /https:\/\/.*\.devland\.is/,
      /http:\/\/localhost:*/,
    ],
    beforeSend: (event) => {
      event.view.url = maskNationalId(event.view.url)
      return true
    },
  })
}

export const userMonitoring = { initDdRum }
