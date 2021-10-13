import { Catch } from '@nestjs/common'
import {
  HttpInternalServerErrorProblem,
  Problem,
} from '@island.is/shared/problem'
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
      type: 'https://httpstatuses.com/500',
      title: 'Internal server error',
      ...extraDetails,
    } as HttpInternalServerErrorProblem
  }
}
