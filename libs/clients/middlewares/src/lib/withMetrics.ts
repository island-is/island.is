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
  return (input, init) => {
    client.increment('requests')
    return fetch(input, init)
  }
}
