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
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiQueryOptions,
  ApiResponseMetadata,
  ApiParamOptions,
} from '@nestjs/swagger'

import { HttpProblemResponse } from '@island.is/nest/problem'

interface Options {
  isAuthorized?: boolean
  queries?: ApiQueryOptions[]
  params?: ApiParamOptions[]
  description?: string
  response: {
    status: 200 | 201 | 204
    type?: ApiResponseMetadata['type']
  }
}

const getResponseDecorator = (
  response: Options['response'],
): MethodDecorator => {
  switch (response.status) {
    case 200:
      return ApiOkResponse(response)
    case 201:
      return ApiCreatedResponse(response)
    case 204:
      return ApiNoContentResponse(response)
  }
}

const getQueriesDecorators = (
  queries: Options['queries'],
): MethodDecorator[] => {
  if (!queries) {
    return []
  }

  return queries.map((options) => ApiQuery(options))
}

const getParamsDecorators = (params: Options['params']): MethodDecorator[] => {
  if (!params) {
    return []
  }

  return params.map((options) => ApiParam(options))
}

const getOptionalDecorators = (
  isAuthorized: Options['isAuthorized'],
): MethodDecorator[] => {
  if (!isAuthorized) {
    return []
  }

  return [ApiUnauthorizedResponse({ type: HttpProblemResponse })]
}

export const Documentation = ({
  isAuthorized = true,
  response,
  queries,
  params,
  description,
}: Options): MethodDecorator =>
  applyDecorators(
    HttpCode(response.status),
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse(),
    ApiBadRequestResponse({ type: HttpProblemResponse }),
    ApiForbiddenResponse({ type: HttpProblemResponse }),
    ApiConflictResponse({ type: HttpProblemResponse }),
    ApiOperation({ description }),
    getResponseDecorator(response),
    ...getOptionalDecorators(isAuthorized),
    ...getQueriesDecorators(queries),
    ...getParamsDecorators(params),
  )
