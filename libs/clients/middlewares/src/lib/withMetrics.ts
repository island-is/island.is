import { DogStatsD } from '@island.is/infra-metrics'

import { FetchAPI, Response } from './nodeFetch'
import { parseCacheStatusHeader } from './withCache/CacheStatus'
import { FetchError } from './FetchError'

export interface MetricsMiddlewareOptions {
  fetch: FetchAPI
  metricsClient: DogStatsD
}

const isCacheHit = (response: Response) => {
  const lastCacheStatus = parseCacheStatusHeader(
    response.headers.get('cache-status'),
  ).pop()
  return lastCacheStatus?.hit ?? false
}

export const withMetrics = ({
  fetch,
  metricsClient,
}: MetricsMiddlewareOptions): FetchAPI => {
  const handleMetrics = (response?: Response, error?: Error) => {
    // Support errors thrown by withResponseError middleware.
    if (error instanceof FetchError) {
      response = error.response
    }

    if (response) {
      const tags = { cache: isCacheHit(response) ? 'hit' : 'miss' }
      metricsClient.increment('requests', 1, tags)
      if (response.status >= 200 && response.status < 300) {
        metricsClient.increment('requests.2xx', 1, tags)
        metricsClient.increment('requests.ok', 1, tags)
      } else if (response.status >= 300 && response.status < 400) {
        metricsClient.increment('requests.3xx', 1, tags)
        metricsClient.increment('requests.ok', 1, tags)
      } else if (response.status >= 400 && response.status < 500) {
        metricsClient.increment('requests.4xx', 1, tags)
        metricsClient.increment('requests.error', 1, tags)
      } else if (response.status >= 500 && response.status < 600) {
        metricsClient.increment('requests.5xx', 1, tags)
        metricsClient.increment('requests.error', 1, tags)
      }
    } else {
      const tags = { cache: 'miss' }
      metricsClient.increment('requests', 1, tags)
      metricsClient.increment('requests.network_error', 1, tags)
      metricsClient.increment('requests.error', 1, tags)
    }
  }

  return async (input, init) => {
    try {
      const response = await fetch(input, init)
      handleMetrics(response)
      return response
    } catch (error) {
      handleMetrics(undefined, error)
      throw error
    }
  }
}
