import { BadRequestException, HttpException } from '@nestjs/common'
import { ProblemError } from './ProblemError'
import { ProblemType, Problem } from '@island.is/shared/problem'

describe('ProblemError', () => {
  it('supports basic problem details', () => {
    // Arrange
    const problem: Problem = {
      type: ProblemType.HTTP_BAD_REQUEST,
      title: 'Test error',
    }

    // Act
    const problemError = new ProblemError(problem)

    // Assert
    expect(problemError).toMatchObject({
      message: problem.title,
      problem: problem,
    })
  })

  it('supports full problem details', () => {
    // Arrange
    const problem: Problem = {
      type: ProblemType.HTTP_BAD_REQUEST,
      title: 'Test error',
      status: 400,
      detail: 'Details',
      instance: 'instance',
    }

    // Act
    const problemError = new ProblemError(problem)

    // Assert
    expect(problemError).toMatchObject({
      message: [problem.title, problem.detail].join(' - '),
      problem: problem,
    })
  })

  it('support http exceptions with string response', () => {
    // Arrange
    const exception = new HttpException('Test', 500)

    // Act
    const problemError = ProblemError.fromHttpException(exception)

    // Assert
    expect(problemError).toMatchObject({
      message: 'Test',
      problem: {
        type: 'https://httpstatuses.com/500',
        title: 'Test',
        status: 500,
      },
    })
  })

  it('support http exceptions with error response', () => {
    // Arrange
    const exception = new BadRequestException('This happened')

    // Act
    const problemError = ProblemError.fromHttpException(exception)

    // Assert
    expect(problemError).toMatchObject({
      message: 'Bad Request - This happened',
      problem: {
        type: 'https://httpstatuses.com/400',
        title: 'Bad Request',
        detail: 'This happened',
        status: 400,
      },
    })
  })
})
