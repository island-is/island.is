import { maskNationalId } from '@island.is/shared/pii'
import { datadogRum } from '@datadog/browser-rum'

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
    sampleRate: 100,
    trackInteractions: true,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    trackFrustrations: true,
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

export const {
  startSessionReplayRecording,
  stopSessionReplayRecording,
} = datadogRum

export const userMonitoring = { initDdRum }
