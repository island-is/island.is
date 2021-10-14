import { ProblemType } from '@island.is/shared/problem'
import { ForbiddenError } from 'apollo-server-express'
import { CreateRequest, setup } from './test/setup'
import { expectGraphqlProblem } from './test/expectGraphqlProblem'

const handler = () => {
  throw new ForbiddenError('User does not access.')
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
        "status": 403,
        "title": "Forbidden",
        "type": "https://httpstatuses.com/403",
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
})
