import { Logger, logger as islandis_logger } from '@island.is/logging'
// eslint-disable-next-line no-restricted-imports
import { pick } from 'lodash'

import { FetchMiddlewareOptions, MiddlewareAPI } from './nodeFetch'
import { FetchError } from './FetchError'

interface ErrorLogOptions extends FetchMiddlewareOptions {
  name: string
  logger: Logger
  treat400ResponsesAsErrors: boolean
}

export function withErrorLog({
  name,
  fetch,
  treat400ResponsesAsErrors,
  logger,
}: ErrorLogOptions): MiddlewareAPI {
  return (request) => {
    islandis_logger.debug(
      `Extended fetch request. ${JSON.stringify(
        pick(request, [
          'url',
          'agent',
          'json',
          'headers',
          'auth',
          'method',
          'timeout',
          'body',
        ]),
      )}`,
    )
    return fetch(request)
      .then((r) => {
        islandis_logger.debug(
          `Extended fetch response. ${JSON.stringify(
            pick(r, ['status', 'statusText', 'body', 'headers', 'url']),
          )}`,
        )
        return r
      })
      .catch((error: Error) => {
        const logLevel =
          error instanceof FetchError &&
          error.status < 500 &&
          !treat400ResponsesAsErrors
            ? 'warn'
            : 'error'
        const cacheStatus =
          (error instanceof FetchError &&
            error.response.headers.get('cache-status')) ??
          undefined

        logger.log(logLevel, {
          ...error,
          stack: error.stack,
          url: request.url,
          message: `Fetch failure (${name}): ${error.message}`,
          cacheStatus,
          // Do not log large response objects.
          response: undefined,
        })
        throw error
      })
  }
}
