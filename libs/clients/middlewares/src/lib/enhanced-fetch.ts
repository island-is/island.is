import CircuitBreaker from 'opossum'
import { Logger } from 'winston'
import { logger as defaultLogger } from '@island.is/logging'

type FetchAPI = WindowOrWorkerGlobalScope['fetch']

interface FetchProblem {
  type: string
  title: string
  status?: number
  detail?: string
  instance?: string
  [key: string]: unknown
}

interface FetchError extends Error {
  url: string
  status: number
  headers: Headers
  statusText: string
  response: Response
  body?: unknown
  problem?: FetchProblem
}

export interface OpenApiFetchOptions {
  // The name of this fetch function, used in logs and opossum stats.
  name: string

  // By default 400 responses are considered warnings and will not open the circuit.
  // This can be changed by passing `treat400ResponsesAsErrors: true`.
  // Either way they will be logged and thrown.
  treat400ResponsesAsErrors?: boolean

  // If true, will log error response body. Defaults to false.
  // Should only be used if error objects do not have sensitive information or PII.
  logErrorResponseBody?: boolean

  // Configure circuit breaker logic.
  opossum?: CircuitBreaker.Options

  // Override logger.
  logger?: Logger

  // Override fetch function.
  fetch?: FetchAPI
}

const createResponseError = async (response: Response, includeBody = false) => {
  const error = new Error(
    `Request failed with status code ${response.status}`,
  ) as FetchError
  const { url, status, headers, statusText } = response
  Object.assign(error, { url, status, headers, statusText, response })

  const contentType = response.headers.get('content-type')
  const isJson = contentType === 'application/json'
  const isProblem = contentType === 'application/problem+json'
  const shouldIncludeBody = includeBody && (isJson || isProblem)
  if (isProblem || shouldIncludeBody) {
    const body = await response.clone().json()
    if (shouldIncludeBody) {
      error.body = body
    }
    if (isProblem) {
      error.problem = body
    }
  } else if (includeBody) {
    error.body = await response.clone().text()
  }

  return error
}

/**
 * Creates a fetch function for resilient ops:
 *
 * - Includes circuit breaker logic. By default, if more than 50% of the
 *   requests from the last 10 seconds are misbehaving, we'll open the circuit.
 *   All future requests will be stopped to lower pressure on the remote server.
 *   Every 30 seconds we'll allow one request through. If it's successful, we'll
 *   close the circuit and let requests through again.
 *
 * - Includes request timeout logic. By default, throws an error if there is no
 *   response in 10 seconds.
 *
 * - Throws an error for non-200 responses. The error object includes details
 *   from the response, including a `problem` property if the response implements
 *   the [Problem Spec](https://datatracker.ietf.org/doc/html/rfc7807).
 *
 * - Logs circuit breaker events and failing requests
 *
 * - Optionally opens the circuit for 400 responses.
 *
 * - Optionally parses and logs error response bodies.
 *
 * This function (and it's error logic) is mostly compatible with "OpenAPI
 * Generator" clients. The only difference revolve around non-200 responses. It
 * throws an Error object instead of the response (all response properties are
 * copied to the Error object), and since these errors are thrown "inside" the
 * fetch call, any "post" middlewares will not be invoked for non-200 responses.
 */
export const createEnhancedFetch = (options: OpenApiFetchOptions): FetchAPI => {
  const name = options.name
  const actualFetch = options.fetch ?? fetch
  const logger = options.logger ?? defaultLogger
  const treat400ResponsesAsErrors = options.treat400ResponsesAsErrors === true

  const enhancedFetch: FetchAPI = async (input, init) => {
    const response = await actualFetch(input, init)
    const ok = treat400ResponsesAsErrors ? response.ok : response.status < 500
    if (!ok) {
      throw await createResponseError(response, options.logErrorResponseBody)
    }
    return response
  }

  const breaker = new CircuitBreaker(enhancedFetch, {
    name,
    ...options.opossum,
  })

  breaker.on('failure', async (error, latencyMs, args) => {
    logger.error({
      ...error,
      url: args[0],
      message: `Fetch failure (${name}): ${error.message}`,
      // Do not log large response objects.
      response: undefined,
    })
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

  return async (input, init) => {
    const response = await breaker.fire(input, init)

    // Log and throw 400 responses, if they have not already been thrown from
    // inside the circuit breaker.
    if (!response.ok) {
      const error = await createResponseError(
        response,
        options.logErrorResponseBody,
      )
      logger.warn({
        ...error,
        message: `Fetch failure (${name}): ${error.message}`,
        // Do not log large response objects.
        response: undefined,
      })
      throw error
    }
    return response
  }
}
