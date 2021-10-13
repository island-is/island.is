import { Catch } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { HttpProblem } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

const errors: Record<string, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  BAD_USER_INPUT: 400,
}

@Catch(ApolloError)
export class ApolloErrorFilter extends BaseProblemFilter {
  getProblem(error: ApolloError) {
    const status = errors[error.extensions.code] ?? 500
    return {
      status,
      type: `https://httpstatuses.com/${status}`,
      title: error.message,
    } as HttpProblem
  }
}
