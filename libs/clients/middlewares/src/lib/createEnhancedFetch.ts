import nodeFetch from 'node-fetch'
import CircuitBreaker from 'opossum'
import { Logger } from 'winston'

import { DogStatsD } from '@island.is/infra-metrics'
import { logger as defaultLogger } from '@island.is/logging'
import {
  AGENT_DEFAULT_FREE_SOCKET_TIMEOUT,
  AGENT_DEFAULTS,
  OrganizationSlugType,
} from '@island.is/shared/constants'

import { buildFetch } from './buildFetch'
import { FetchAPI as NodeFetchAPI } from './nodeFetch'
import { EnhancedFetchAPI, AuthSource } from './types'
import { AgentOptions, ClientCertificateOptions, withAgent } from './withAgent'
import { withAuth } from './withAuth'
import { AutoAuthOptions, withAutoAuth } from './withAutoAuth'
import { CacheConfig } from './withCache/types'
import { withCache } from './withCache/withCache'
import { withCircuitBreaker } from './withCircuitBreaker'
import { withErrorLog } from './withErrorLog'
import { withMetrics } from './withMetrics'
import { withResponseErrors } from './withResponseErrors'
import { withTimeout } from './withTimeout'

const DEFAULT_TIMEOUT = 1000 * 20 // seconds

export interface EnhancedFetchOptions {
  /**
   * The name of this fetch function, used in logs and opossum stats.
   */
  name: string

  /**
   * The organization slug used in error logging. This slug matches Contentful's organization content type icelandic "slug" field.
   */
  organizationSlug?: OrganizationSlugType

  /**
   * Configure caching.
   */
  cache?: CacheConfig

  /**
   * Timeout for requests. Defaults to 20000ms. Can be disabled by passing false.
   */
  timeout?: number | false

  /**
   * Disable or configure circuit breaker.
   */
  circuitBreaker?: boolean | CircuitBreaker.Options

  /**
   * Automatically get access token.
   */
  autoAuth?: AutoAuthOptions

  /**
   * Specifies if user agent headers should be forwarded in the request (Real IP, User-Agent). Requires an Auth object
   * to be passed to the fetch function.
   */
  forwardAuthUserAgent?: boolean

  /**
   * If true (default), Enhanced Fetch will log error response bodies.
   * Should be set to false if error objects may have sensitive information or PII.
   */
  logErrorResponseBody?: boolean

  /**
   * Override logger.
   */
  logger?: Logger

  /**
   * Override fetch function.
   */
  fetch?: NodeFetchAPI

  /**
   * Certificate for auth
   */
  clientCertificate?: ClientCertificateOptions

  /**
   * Override configuration for the http agent. E.g. configure a client certificate.
   */
  agentOptions?: AgentOptions

  /**
   * Configures keepAlive for requests. If false, never reuse connections. If true, reuse connection with a maximum
   * idle timeout of 10 seconds. If number, override the idle connection timeout. Defaults to true.
   */
  keepAlive?: boolean | number

  /**
   * The client used to send metrics.
   */
  metricsClient?: DogStatsD

  /**
   * Should the auth be taken from the context or the request. defaults to 'request'.
   */
  authSource?: AuthSource
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
 * - Includes response cache logic built on top of standard cache-control
 *   semantics. By default, nothing is cached.
 *
 * - Supports our `User` and `Auth` objects. Adds authorization header to the
 *   request.
 *
 * - Includes request timeout logic. By default, throws an error if there is no
 *   response in 20 seconds.
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
): EnhancedFetchAPI => {
  const {
    name,
    logger = defaultLogger,
    fetch = nodeFetch,
    timeout = DEFAULT_TIMEOUT,
    logErrorResponseBody = true,
    autoAuth,
    forwardAuthUserAgent = true,
    clientCertificate,
    agentOptions,
    keepAlive = true,
    cache,
    metricsClient = new DogStatsD({ prefix: `${options.name}.` }),
    organizationSlug,
    authSource = 'request',
  } = options
  const freeSocketTimeout =
    typeof keepAlive === 'number'
      ? keepAlive
      : AGENT_DEFAULT_FREE_SOCKET_TIMEOUT
  const builder = buildFetch(fetch, authSource)

  builder.wrap(withAgent, {
    clientCertificate,
    agentOptions: {
      ...AGENT_DEFAULTS,
      keepAlive: !!keepAlive,
      freeSocketTimeout,
      ...agentOptions,

      // We disable the timeout handling on the agent, as it is handled in withTimeout to allow for per request overwrite.
      // https://github.com/node-modules/agentkeepalive#new-agentoptions
      timeout: 0,
    },
  })

  if (timeout !== false) {
    builder.wrap(withTimeout, { timeout })
  }

  builder.wrap(withResponseErrors, {
    includeBody: logErrorResponseBody,
    organizationSlug,
  })

  if (autoAuth) {
    builder.wrap(withAutoAuth, {
      name,
      logger,
      options: autoAuth,
      rootFetch: fetch,
      cache,
    })
  }

  builder.wrap(withAuth, { forwardAuthUserAgent })

  if (options.circuitBreaker !== false) {
    const opossum =
      options.circuitBreaker === true ? {} : options.circuitBreaker ?? {}
    builder.wrap(withCircuitBreaker, {
      name,
      logger,
      opossum,
    })
  }

  if (cache) {
    builder.wrap(withCache, {
      ...cache,
      name,
      logger,
    })

    // Need to handle response errors again.
    builder.wrap(withResponseErrors, {
      includeBody: logErrorResponseBody,
      organizationSlug,
    })
  }

  if (metricsClient) {
    builder.wrap(withMetrics, { metricsClient })
  }

  builder.wrap(withErrorLog, {
    name,
    logger,
  })

  return builder.getFetch()
}
