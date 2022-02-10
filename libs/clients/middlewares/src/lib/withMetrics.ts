import { DogStatsD } from '@island.is/infra-metrics'

import { FetchAPI } from './nodeFetch'

export interface MetricsMiddlewareOptions {
  fetch: FetchAPI
  metricsClient: DogStatsD
}

export const withMetrics = ({
  fetch,
  metricsClient,
}: MetricsMiddlewareOptions): FetchAPI => {
  return async (input, init) => {
    try {
      metricsClient.increment('requests')
      const response = await fetch(input, init)
      if (response.status >= 200 && response.status < 300) {
        metricsClient.increment('requests.2xx')
        metricsClient.increment('requests.ok')
      } else if (response.status >= 300 && response.status < 400) {
        metricsClient.increment('requests.3xx')
        metricsClient.increment('requests.ok')
      } else if (response.status >= 400 && response.status < 500) {
        metricsClient.increment('requests.4xx')
        metricsClient.increment('requests.error')
      } else if (response.status >= 500 && response.status < 600) {
        metricsClient.increment('requests.5xx')
        metricsClient.increment('requests.error')
      }
      return response
    } catch (error) {
      metricsClient.increment('requests.network_error')
      metricsClient.increment('requests.error')
      throw error
    }
  }
}
