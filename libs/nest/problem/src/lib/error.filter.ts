import { Catch } from '@nestjs/common'
import { Problem, ProblemType } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

@Catch(Error)
export class ErrorFilter extends BaseProblemFilter {
  getProblem(error: Error): Problem {
    this.logger.error(error)

    const extraDetails =
      process.env.NODE_ENV !== 'production'
        ? { detail: error.message, stack: error.stack }
        : null

    return {
      status: 500,
      type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      ...extraDetails,
    }
  }
}
