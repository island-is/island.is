import https from 'https'
import { SecureContextOptions } from 'tls'

import CircuitBreaker from 'opossum'
import fetch from 'node-fetch'
import { Logger } from 'winston'
import { logger as defaultLogger } from '@island.is/logging'

export type FetchAPI = WindowOrWorkerGlobalScope['fetch']

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

// Chrerry-pick the supported types of certs from TLS
export interface FetchCertificate {
  pfx: SecureContextOptions['pfx']
  passphrase: SecureContextOptions['passphrase']
}

export interface EnhancedFetchOptions {
  // The name of this fetch function, used in logs and opossum stats.
  name: string

  // Timeout for requests. Defaults to 10000ms. Can be disabled by passing false.
  timeout?: number | false

  // Shortcut to disable circuit breaker. Keeps timeout and logging.
  enableCircuitBreaker?: boolean

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

  // Certificate for auth
  certificate?: FetchCertificate
}

const createResponseError = async (response: Response, includeBody = false) => {
  const error = new Error(
    `Request failed with status code ${response.status}`,
  ) as FetchError
  error.name = 'FetchError'
  const { url, status, headers, statusText } = response
  Object.assign(error, { url, status, headers, statusText, response })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.startsWith('application/json')
  const isProblem = contentType.startsWith('application/problem+json')
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
export const createEnhancedFetch = (
  options: EnhancedFetchOptions,
): FetchAPI => {
  const name = options.name
  const actualFetch = options.fetch ?? ((fetch as unknown) as FetchAPI)
  const logger = options.logger ?? defaultLogger
  const timeout = options.timeout ?? 10000
  const treat400ResponsesAsErrors = options.treat400ResponsesAsErrors === true

  /**
   * Create an https agent that manages the certificate.
   * `agent` is an extension from node-fetch and is not a part of the fetch spec
   * https://github.com/node-fetch/node-fetch#custom-agent
   */
  const agent = options.certificate
    ? new https.Agent({
        pfx: options.certificate.pfx,
        passphrase: options.certificate.passphrase,
      })
    : undefined

  const enhancedFetch: FetchAPI = async (input, init) => {
    try {
      const response = await actualFetch(input, ({
        timeout,
        agent,
        ...init,
      } as unknown) as RequestInit)

      if (!response.ok) {
        throw await createResponseError(response, options.logErrorResponseBody)
      }

      return response
    } catch (error) {
      const logLevel =
        error.name === 'FetchError' &&
        error.status < 500 &&
        !treat400ResponsesAsErrors
          ? 'warn'
          : 'error'
      logger.log(logLevel, {
        ...error,
        stack: error.stack,
        url: input,
        message: `Fetch failure (${name}): ${error.message}`,
        // Do not log large response objects.
        response: undefined,
      })
      throw error
    }
  }

  const errorFilter = treat400ResponsesAsErrors
    ? options.opossum?.errorFilter
    : (error: FetchError) => {
        if (error.name === 'FetchError' && error.status < 500) {
          return true
        }
        return options.opossum?.errorFilter?.(error) ?? false
      }

  const breaker = new CircuitBreaker(enhancedFetch, {
    name,
    volumeThreshold: 10,
    // False disables timeout logic, the types are incorrect.
    // We want to use our own timeout logic so we can disable the circuit
    // breaker while still supporting timeouts.
    timeout: (false as unknown) as number,
    enabled: options.enableCircuitBreaker !== false,

    ...options.opossum,
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

  return (input, init) => breaker.fire(input, init)
}
