import { applyDecorators } from '@nestjs/common'

import { Documentation, Options } from './documentation.decorator'

const HttpCode = (httpCode: number) => httpCode
const ApiBadRequestResponse = 'ApiBadRequestResponse'
const ApiConflictResponse = 'ApiConflictResponse'
const ApiCreatedResponse = 'ApiCreatedResponse'
const ApiForbiddenResponse = 'ApiForbiddenResponse'
const ApiInternalServerErrorResponse = 'ApiInternalServerErrorResponse'
const ApiNoContentResponse = 'ApiNoContentResponse'
const ApiNotFoundResponse = 'ApiNotFoundResponse'
const ApiOkResponse = 'ApiOkResponse'
const ApiOperation = 'ApiOperation'
const ApiParam = 'ApiParam'
const ApiQuery = 'ApiQuery'
const ApiUnauthorizedResponse = 'ApiUnauthorizedResponse'

const getDefaultDecorators = (httpStatus?: number) => [
  HttpCode(httpStatus ?? 200),
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
]

jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common')
  return {
    ...originalModule,
    HttpCode: (httpCode: number) => httpCode,
    applyDecorators: jest.fn(),
  }
})

jest.mock('@nestjs/swagger', () => {
  const originalModule = jest.requireActual('@nestjs/swagger')
  return {
    ...originalModule,
    ApiBadRequestResponse: () => ApiBadRequestResponse,
    ApiConflictResponse: () => ApiConflictResponse,
    ApiCreatedResponse: () => ApiCreatedResponse,
    ApiForbiddenResponse: () => ApiForbiddenResponse,
    ApiInternalServerErrorResponse: () => ApiInternalServerErrorResponse,
    ApiNoContentResponse: () => ApiNoContentResponse,
    ApiNotFoundResponse: () => ApiNotFoundResponse,
    ApiOkResponse: () => ApiOkResponse,
    ApiOperation: () => ApiOperation,
    ApiParam: () => ApiParam,
    ApiQuery: () => ApiQuery,
    ApiUnauthorizedResponse: () => ApiUnauthorizedResponse,
  }
})

describe('Documentation decorator', () => {
  it('should apply ApiOkResponse decorator for 200', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
    )
  })

  it('should apply (ApiCreated|ApiConflict)Response decorator for 201', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 201,
      },
      isAuthorized: false,
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiCreatedResponse,
      ApiConflictResponse,
    )
  })

  it('should apply ApiNoContentResponse decorator for 204', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 204,
      },
      isAuthorized: false,
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiNoContentResponse,
    )
  })

  it('should automatically apply ApiUnauthorizedResponse decorator', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiUnauthorizedResponse,
      ApiForbiddenResponse,
    )
  })

  it('should apply ApiOperation decorator for descriptions', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
      description: 'description',
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiOperation,
    )
  })

  it('should apply ApiOperation decorator for summary', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
      summary: 'summary',
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiOperation,
    )
  })

  it('should apply ApiOperation decorator for deprecated', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
      deprecated: true,
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiOperation,
    )
  })

  it('should apply x ApiQuery decorator for x request.query', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
      request: {
        query: {
          test1: {},
          test2: {},
          test3: {},
          test4: {},
        },
      },
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiQuery,
      ApiQuery,
      ApiQuery,
      ApiQuery,
    )
  })

  it('should apply x ApiParam decorator for x request.params', () => {
    // Arrange
    const options: Options = {
      response: {
        status: 200,
      },
      isAuthorized: false,
      request: {
        params: {
          test1: {},
          test2: {},
          test3: {},
          test4: {},
        },
      },
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
      ApiNotFoundResponse,
      ApiParam,
      ApiParam,
      ApiParam,
      ApiParam,
    )
  })

  it('should default to 200 response', () => {
    // Arrange
    const options: Options = {
      isAuthorized: false,
    }

    // Act
    Documentation(options)

    // Assert
    expect(applyDecorators).toHaveBeenCalledWith(
      ...getDefaultDecorators(options.response?.status),
      ApiOkResponse,
    )
  })
})
