import { Logger } from 'winston'

import { FetchAPI, FetchMiddlewareOptions } from './nodeFetch'
import { FetchError } from './FetchError'

interface ErrorOptions extends FetchMiddlewareOptions {
  logErrorResponseBody: boolean
  treat400ResponsesAsErrors: boolean
  logger: Logger
}

export function withErrors({
  fetch,
  logErrorResponseBody,
  treat400ResponsesAsErrors,
  logger,
}: ErrorOptions): FetchAPI {
  return async (input, init) => {
    try {
      const response = await fetch(input, init)
      if (!response.ok) {
        throw await FetchError.build(response, logErrorResponseBody)
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
}
