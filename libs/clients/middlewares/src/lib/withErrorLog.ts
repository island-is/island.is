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
