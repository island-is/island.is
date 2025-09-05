import { OrganizationSlugType } from '@island.is/shared/constants'
import { BodyInit, Headers, Response, ResponseInit } from 'node-fetch'
import { UnknownProblem } from '@island.is/shared/problem'

export class FetchError extends Error {
  name = 'FetchError'

  url: string
  status: number
  headers: Headers
  statusText: string
  response: Response
  body?: unknown
  problem?: UnknownProblem
  organizationSlug?: OrganizationSlugType

  private constructor(
    response: Response,
    organizationSlug?: OrganizationSlugType,
  ) {
    super(`Request failed with status code ${response.status}`)
    this.url = response.url
    this.status = response.status
    this.headers = response.headers
    this.statusText = response.statusText
    this.response = response
    this.organizationSlug = organizationSlug
  }

  static async build(
    response: Response,
    includeBody = false,
    organizationSlug?: OrganizationSlugType,
  ) {
    const error = new FetchError(response, organizationSlug)
    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.startsWith('application/json')
    const isProblem = contentType.startsWith('application/problem+json')
    const shouldIncludeBody = includeBody && (isJson || isProblem)

    if (isProblem || shouldIncludeBody) {
      const body = await response.clone().json()

      if (shouldIncludeBody) {
        error.body = body
      }

      if (isProblem) {
        error.problem = body
      }
    } else if (includeBody) {
      error.body = await response.clone().text()
    }

    return error
  }

  static async buildMock(init: ResponseInit, body: BodyInit = '') {
    return this.build(new Response(body, init))
  }
}
