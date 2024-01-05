import { OrganizationSlugType } from '@island.is/shared/constants'

import { MiddlewareAPI, FetchMiddlewareOptions } from './nodeFetch'
import { FetchError } from './FetchError'

interface ResponseErrorsOptions extends FetchMiddlewareOptions {
  includeBody: boolean
  organizationSlug?: OrganizationSlugType
}

export function withResponseErrors({
  fetch,
  includeBody,
  organizationSlug,
}: ResponseErrorsOptions): MiddlewareAPI {
  return async (request) => {
    const response = await fetch(request)
    if (!response.ok) {
      throw await FetchError.build(response, includeBody, organizationSlug)
    }

    return response
  }
}
