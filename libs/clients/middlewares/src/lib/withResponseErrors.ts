import { FetchAPI, FetchMiddlewareOptions } from './nodeFetch'
import { FetchError } from './FetchError'

interface ResponseErrorsOptions extends FetchMiddlewareOptions {
  includeBody: boolean
}

export function withResponseErrors({
  fetch,
  includeBody,
}: ResponseErrorsOptions): FetchAPI {
  return async (input, init) => {
    const response = await fetch(input, init)
    if (!response.ok) {
      throw await FetchError.build(response, includeBody)
    }

    return response
  }
}
