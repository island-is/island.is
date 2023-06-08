import { Logger } from 'winston'
import CircuitBreaker from 'opossum'

import { MiddlewareAPI } from './nodeFetch'
import { FetchError } from './FetchError'

export interface CircuitBreakerOptions {
  treat400ResponsesAsErrors: boolean
  opossum: CircuitBreaker.Options
  fetch: MiddlewareAPI
  name: string
  logger: Logger
}

export function withCircuitBreaker({
  treat400ResponsesAsErrors,
  opossum,
  fetch,
  name,
  logger,
}: CircuitBreakerOptions): MiddlewareAPI {
  const errorFilter = treat400ResponsesAsErrors
    ? opossum?.errorFilter
    : (error: FetchError) => {
        if (error.name === 'FetchError' && error.status < 500) {
          return true
        }
        return opossum?.errorFilter?.(error) ?? false
      }

  const breaker = new CircuitBreaker(fetch, {
    name,
    volumeThreshold: 10,
    // False disables timeout logic, the types are incorrect.
    // We want to use our own timeout logic so we can disable the circuit
    // breaker while still supporting timeouts.
    timeout: false as unknown as number,

    ...opossum,
    errorFilter,
  })

  breaker.on('open', () =>
    logger.error(`Fetch (${name}): Too many errors, circuit breaker opened`),
  )
  breaker.on('halfOpen', () =>
    logger.error(`Fetch (${name}): Circuit breaker half-open`),
  )
  breaker.on('close', () =>
    logger.error(`Fetch (${name}): Circuit breaker closed`),
  )

  return (request) => breaker.fire(request)
}
