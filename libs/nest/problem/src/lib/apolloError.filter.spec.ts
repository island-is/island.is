import { ProblemType } from '@island.is/shared/problem'
import { GraphQLError } from 'graphql'
import { CreateRequest, setup } from './test/setup'
import { expectGraphqlProblem } from './test/expectGraphqlProblem'

const handler = () => {
  throw new GraphQLError('User does not access.', {
    extensions: { code: 'FORBIDDEN' },
  })
}

describe('ApolloErrorFilter', () => {
  let request: CreateRequest
  beforeAll(async () => {
    ;[request] = await setup({ handler })
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
        "detail": "User does not access.",
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
      detail: 'User does not access.',
      status: 403,
      title: 'Forbidden',
      type: ProblemType.HTTP_FORBIDDEN,
    })
  })
})

describe('ApolloErrorFilter with unrecognized error code', () => {
  let request: CreateRequest
  beforeAll(async () => {
    ;[request] = await setup({
      handler: () => {
        throw new GraphQLError('Unexpected resolver failure.')
      },
    })
  })

  it('maps to internal server error instead of bad request', async () => {
    // Act
    const response = await request()

    // Assert
    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({
      status: 500,
      title: 'Internal server error',
      type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
    })
  })
})
