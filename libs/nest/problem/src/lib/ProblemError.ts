import { HttpException } from '@nestjs/common'
import { HttpProblem, Problem } from '@island.is/shared/problem'

type HttpExceptionResponse = string | { message: string; error?: string }
export interface ProblemOptions {
  /** original cause of the error */
  cause?: unknown
}

export class ProblemError extends Error {
  constructor(public problem: Problem, options?: ProblemOptions) {
    super(
      problem.detail ? `${problem.title} - ${problem.detail}` : problem.title,
      options,
    )
    Object.defineProperty(this, 'name', { value: 'ProblemError' })

    if (
      process.env.NODE_ENV !== 'production' &&
      !problem.type.startsWith('http')
    ) {
      throw new Error('ProblemError type must be a URL.')
    }
  }

  static fromHttpException(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as HttpExceptionResponse
    let title, detail
    if (typeof response === 'string') {
      title = response
    } else {
      title = response.error || response.message
      detail = response.error ? response.message : undefined
    }

    return new ProblemError({
      status: status,
      type: `https://httpstatuses.org/${status}`,
      title,
      detail,
    } as HttpProblem)
  }
}
