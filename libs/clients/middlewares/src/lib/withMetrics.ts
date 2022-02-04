import { dogStatsD } from '@island.is/infra-metrics'

import { FetchAPI } from './nodeFetch'

export interface MetricsMiddlewareOptions {
  fetch: FetchAPI
  name: string
}

export const withMetrics = ({
  fetch,
  name,
}: MetricsMiddlewareOptions): FetchAPI => {
  const client = dogStatsD({
    prefix: `${name}.`,
  })
  return async (input, init) => {
    try {
      const response = await fetch(input, init)
      client.increment('requests')
      if (response.status >= 200 && response.status < 300) {
        client.increment('requests.2xx')
        client.increment('requests.ok')
      } else if (response.status >= 300 && response.status < 400) {
        client.increment('requests.3xx')
        client.increment('requests.ok')
      } else if (response.status >= 400 && response.status < 500) {
        client.increment('requests.4xx')
        client.increment('requests.error')
      } else if (response.status >= 500 && response.status < 600) {
        client.increment('requests.5xx')
        client.increment('requests.error')
      }
      return response
    } catch (error) {
      client.increment('requests.client_error')
      throw error
    }
  }
}
