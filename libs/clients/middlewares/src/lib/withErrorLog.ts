import { Logger } from '@island.is/logging'

import { FetchMiddlewareOptions, MiddlewareAPI } from './nodeFetch'
import { FetchError } from './FetchError'

interface ErrorLogOptions extends FetchMiddlewareOptions {
  name: string
  logger: Logger
}

export function withErrorLog({
  name,
  fetch,
  logger,
}: ErrorLogOptions): MiddlewareAPI {
  return async (request) => {
    return fetch(request).catch((error: Error) => {
      const logLevel =
        error instanceof FetchError && error.status < 500 ? 'warn' : 'error'
      const cacheStatus =
        (error instanceof FetchError &&
          error.response.headers.get('cache-status')) ??
        undefined
      const body =
        error instanceof FetchError
          ? typeof error.body === 'string'
            ? trimBody(error.body)
            : error.body
          : undefined

      logger.log(logLevel, {
        ...error,
        stack: error.stack,
        url: request.url,
        message: `Fetch failure (${name}): ${error.message}`,
        fetch: { name },
        body,
        cacheStatus,
        // Do not log large response objects.
        response: undefined,
      })
      throw error
    })
  }
}

const MAX_TEXT_BODY_LENGTH = 512

const trimBody = (body: string) => {
  if (body.length > MAX_TEXT_BODY_LENGTH) {
    return `${body.slice(0, MAX_TEXT_BODY_LENGTH)}...`
  }
  return body
}
