import { Catch } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { HttpProblem, Problem, ProblemType } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

const errorInfo: Record<string, { title: string; status: number }> = {
  // These titles are changed to be consistent with the default title for NestJS HttpException errors.
  UNAUTHENTICATED: { title: 'Unauthorized', status: 401 },
  FORBIDDEN: { title: 'Forbidden', status: 403 },
  BAD_USER_INPUT: { title: 'Bad Request', status: 400 },
}

// GraphQL errors (including the ones our guards throw) are GraphQLError with
// a code in extensions.
@Catch(GraphQLError)
export class ApolloErrorFilter extends BaseProblemFilter {
  getProblem(error: GraphQLError): Problem {
    const code = error.extensions?.code
    const info = typeof code === 'string' ? errorInfo[code] : undefined

    if (!info) {
      // A GraphQLError without a recognized client-error code is an
      // unclassified server failure — map it like the catch-all ErrorFilter
      // so it is logged (the base filter only logs status >= 500).
      const extraDetails =
        process.env.NODE_ENV !== 'production'
          ? { detail: error.message, stack: error.stack }
          : undefined

      return {
        status: 500,
        type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
        title: 'Internal server error',
        ...extraDetails,
      }
    }

    return {
      ...info,
      type: `https://httpstatuses.org/${info.status}`,
      detail: error.message,
    } as HttpProblem
  }
}
