import { MiddlewareAPI, FetchMiddlewareOptions } from './nodeFetch'
import { FetchError } from './FetchError'

interface ResponseErrorsOptions extends FetchMiddlewareOptions {
  includeBody: boolean
}

export function withResponseErrors({
  fetch,
  includeBody,
}: ResponseErrorsOptions): MiddlewareAPI {
  return async (request) => {
    const response = await fetch(request)
    if (!response.ok) {
      throw await FetchError.build(response, includeBody)
    }

    return response
  }
}
