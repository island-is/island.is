import { applyDecorators, HttpCode } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiHeaderOptions,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponseMetadata,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { HttpProblemResponse } from '@island.is/nest/problem'

type ExtendedOmit<T, K extends keyof any> = {
  [P in keyof T as Exclude<P, K>]: T[P]
}

export type DocumentationParamOptions = ExtendedOmit<ApiParamOptions, 'name'>
export type DocumentationQueryOptions = ExtendedOmit<ApiQueryOptions, 'name'>
export type DocumentationHeaderOptions = ExtendedOmit<ApiHeaderOptions, 'name'>

export interface Options {
  request?: {
    params?: Record<string, DocumentationParamOptions>
    query?: Record<string, DocumentationQueryOptions>
    header?: Record<string, DocumentationHeaderOptions>
  }
  response?: {
    status?: 200 | 201 | 202 | 204
    type?: ApiResponseMetadata['type']
  }
  isAuthorized?: boolean
  description?: string
  summary?: string
  deprecated?: boolean
  /** Uses 204 No Content response instead of 404 Not Found for get requests with resource IDs **/
  includeNoContentResponse?: boolean
}

const getResponseDecorators = ({
  response,
}: Options = {}): MethodDecorator[] => {
  switch (response?.status ?? 200) {
    case 200:
      return [ApiOkResponse(response)]
    case 201:
      return [
        ApiCreatedResponse(response),
        ApiConflictResponse({ type: HttpProblemResponse }),
      ]
    case 204:
      return [ApiNoContentResponse(response)]
    default:
      return []
  }
}

const getRequestDecorators = ({
  request: { query = {}, params = {}, header = {} } = {},
  includeNoContentResponse = false,
}: Options = {}): MethodDecorator[] => {
  const queryKeys = Object.keys(query)
  const queryDecorators = queryKeys.map((name) =>
    ApiQuery({ name, ...query[name] }),
  )

  const paramsKeys = Object.keys(params)
  const defaultValue: MethodDecorator[] =
    paramsKeys.length > 0
      ? includeNoContentResponse
        ? [ApiNoContentResponse()]
        : [ApiNotFoundResponse({ type: HttpProblemResponse })]
      : []
  const paramsDecorators = paramsKeys.reduce(
    (acc, name) => [...acc, ApiParam({ name, ...params[name] })],
    defaultValue,
  )

  const headerKeys = Object.keys(header)
  const headerDecorators = headerKeys.map((name) =>
    ApiHeader({ name, ...header[name] }),
  )

  return [...queryDecorators, ...paramsDecorators, ...headerDecorators]
}

const getExtraDecorators = ({
  isAuthorized = true,
  description,
  summary,
  deprecated,
}: Options): MethodDecorator[] => {
  let decorators: MethodDecorator[] = []
  if (isAuthorized) {
    decorators = [
      ...decorators,
      ApiUnauthorizedResponse({ type: HttpProblemResponse }),
      ApiForbiddenResponse({ type: HttpProblemResponse }),
    ]
  }

  if (description || summary || deprecated) {
    decorators = [
      ...decorators,
      ApiOperation({ description, summary, deprecated }),
    ]
  }

  return decorators
}

export const Documentation = (options: Options): MethodDecorator =>
  applyDecorators(
    /* BEGIN DEFAULT DECORATORS */
    HttpCode(options?.response?.status ?? 200),
    ApiInternalServerErrorResponse({ type: HttpProblemResponse }),
    ApiBadRequestResponse({ type: HttpProblemResponse }),
    /* END DEFAULT DECORATORS */

    ...getResponseDecorators(options),
    ...getRequestDecorators(options),
    ...getExtraDecorators(options),
  )
