import { ForbiddenException } from '@nestjs/common'

import { ProblemType } from '@island.is/shared/problem'

import { NoContentException } from './NoContentException'
import { expectGraphqlProblem } from './test/expectGraphqlProblem'
import { CreateRequest, setup } from './test/setup'

describe('HttpExceptionFilter', () => {
  let request: CreateRequest
  let handler: jest.Mock

  beforeAll(async () => {
    ;[request, handler] = await setup({
      handler: () => {
        throw new ForbiddenException()
      },
    })
  })

  it('returns valid problem response', async () => {
    // Act
    const response = await request()

    // Assert
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "status": 403,
        "title": "Forbidden",
        "type": "https://httpstatuses.org/403",
      }
    `)
  })

  it('includes custom message', async () => {
    // Arrange
    handler.mockImplementationOnce(() => {
      throw new ForbiddenException('Custom error')
    })

    // Act
    const response = await request()

    // Assert
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "detail": "Custom error",
        "status": 403,
        "title": "Forbidden",
        "type": "https://httpstatuses.org/403",
      }
    `)
  })

  it(`adds problem as GraphQL error extension`, async () => {
    // Act
    const response = await request('graphql')

    // Assert
    expectGraphqlProblem(response, {
      status: 403,
      title: 'Forbidden',
      type: ProblemType.HTTP_FORBIDDEN,
    })
  })

  it('returns 204 and empty body for NoContentException', async () => {
    // Arrange
    handler.mockImplementationOnce(() => {
      throw new NoContentException()
    })

    // Act
    const response = await request()

    // Assert
    expect(response.status).toBe(204)
    expect(response.body).toStrictEqual({})
  })
})
