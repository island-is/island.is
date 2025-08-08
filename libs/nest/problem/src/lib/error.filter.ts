import type { FetchError } from '@island.is/clients/middlewares'
import { Catch } from '@nestjs/common'
import { Problem, ProblemType } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

@Catch(Error)
export class ErrorFilter extends BaseProblemFilter {
  getProblem(error: Error): Problem {
    const extraDetails =
      process.env.NODE_ENV !== 'production'
        ? { detail: error.message, stack: error.stack }
        : undefined

    return {
      status: 500,
      type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      organizationSlug: (error as FetchError).organizationSlug,
      ...extraDetails,
    }
  }
}
