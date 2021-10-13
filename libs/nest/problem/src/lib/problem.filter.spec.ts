import { ValidationProblem } from './ValidationProblem'
import { CreateRequest, setup } from './test/setup'
import { expectGraphqlProblem } from './test/expectGraphqlProblem'
import { ProblemType } from '@island.is/shared/problem'

const handler = () => {
  throw new ValidationProblem({ field: 'error' })
}

describe('ProblemFilter', () => {
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
        "detail": "Found issues in these fields: field",
        "fields": Object {
          "field": "error",
        },
        "status": 400,
        "title": "Validation failed",
        "type": "https://docs.devland.is/reference/problems/validation-problem",
      }
    `)
  })

  it('adds problem as GraphQL error extensions', async () => {
    // Act
    const response = await request('graphql')

    // Assert
    expectGraphqlProblem(response, {
      detail: 'Found issues in these fields: field',
      fields: {
        field: 'error',
      },
      status: 400,
      title: 'Validation failed',
      type: ProblemType.VALIDATION_PROBLEM,
    })
  })
})
