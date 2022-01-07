import { applyDecorators, HttpCode } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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

interface Options {
  request?: {
    params?: Record<string, ExtendedOmit<ApiParamOptions, 'name'>>
    query?: Record<string, ExtendedOmit<ApiQueryOptions, 'name'>>
  }
  response: {
    status: 200 | 201 | 204
    type?: ApiResponseMetadata['type']
  }
  isAuthorized?: boolean
  description?: string
}

const getResponseDecorators = (
  response: Options['response'],
): MethodDecorator[] => {
  switch (response.status) {
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
  query = {},
  params = {},
}: Options['request'] = {}): MethodDecorator[] => {
  const queryDecorators = Object.keys(query).map((name) =>
    ApiQuery({ name, ...query[name] }),
  )
  const paramsDecorators = Object.keys(params).map((name) =>
    ApiParam({ name, ...params[name] }),
  )

  return [...queryDecorators, ...paramsDecorators]
}

const getExtraDecorators = ({
  isAuthorized,
  description,
}: Omit<Options, 'response' | 'request'>): MethodDecorator[] => {
  let decorators: MethodDecorator[] = []
  if (isAuthorized) {
    decorators = [
      ...decorators,
      ApiUnauthorizedResponse({ type: HttpProblemResponse }),
    ]
  }

  if (description) {
    decorators = [...decorators, ApiOperation({ description })]
  }

  return decorators
}

export const Documentation = ({
  response,
  request,
  ...extra
}: Options): MethodDecorator =>
  applyDecorators(
    /* BEGIN DEFAULT DECORATORS */
    HttpCode(response.status),
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse(),
    ApiBadRequestResponse({ type: HttpProblemResponse }),
    ApiForbiddenResponse({ type: HttpProblemResponse }),
    /* END DEFAULT DECORATORS */

    ...getResponseDecorators(response),
    ...getRequestDecorators(request),
    ...getExtraDecorators(extra),
  )
