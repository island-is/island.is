import { HttpProblem, ProblemType } from '@island.is/shared/problem'
import { Logger } from '@island.is/logging'
import { ProblemError } from './ProblemError'
import { CreateRequest, setup } from './test/setup'
import { expectGraphqlProblem } from './test/expectGraphqlProblem'

describe('ErrorFilter', () => {
  let request: CreateRequest
  let handler: jest.Mock
  let logger: Logger
  let errorLog: jest.SpyInstance
  beforeAll(async () => {
    ;[request, handler, logger] = await setup({
      handler: () => {
        throw new Error('Test error')
      },
    })
    errorLog = jest.spyOn(logger, 'error').mockImplementation(() => logger)
  })

  beforeEach(() => {
    errorLog.mockClear()
  })

  it('returns valid problem response', async () => {
    // Act
    const response = await request()

    // Assert
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.body).toMatchObject({
      detail: 'Test error',
      stack: expect.stringContaining('Test error'),
      status: 500,
      title: 'Internal server error',
      type: 'https://httpstatuses.com/500',
    })
  })

  it('logs error', async () => {
    // Act
    await request()

    // Assert
    expect(errorLog).toHaveBeenCalled()
    expect(errorLog.mock.calls[0][0]).toMatchInlineSnapshot(
      `[Error: Test error]`,
    )
  })

  it(`adds problem as GraphQL error extension`, async () => {
    // Act
    const response = await request('graphql')

    // Assert
    expectGraphqlProblem(response, {
      detail: 'Test error',
      stack: expect.stringContaining('Test error'),
      status: 500,
      title: 'Internal server error',
      type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
    })
  })

  it('adds existing `error.problem` as GraphQL error extension', async () => {
    // Arrange
    const expectedProblem = {
      type: ProblemType.HTTP_FORBIDDEN,
      title: 'Forbidden',
    } as HttpProblem
    handler.mockImplementation(() => {
      const error = new Error('Some error')
      ;(error as ProblemError).problem = expectedProblem
      throw error
    })

    // Act
    const response = await request('graphql')

    // Assert
    expectGraphqlProblem(response, expectedProblem)
  })
})
