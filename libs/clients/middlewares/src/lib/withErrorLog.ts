import { Logger } from '@island.is/logging'

import { FetchAPI, FetchMiddlewareOptions } from './nodeFetch'
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
}: ErrorLogOptions): FetchAPI {
  return (input, init) => {
    return fetch(input, init).catch((error) => {
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
    })
  }
}
