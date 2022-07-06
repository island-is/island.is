import { Logger } from '@island.is/logging'

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
    return fetch(request).catch((error: Error) => {
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
