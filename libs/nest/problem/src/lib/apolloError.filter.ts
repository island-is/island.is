import { Catch } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { HttpProblem } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

const errorInfo: Record<string, { title: string; status: number }> = {
  // These titles are changed to be consistent with the default title for NestJS HttpException errors.
  UNAUTHENTICATED: { title: 'Unauthorized', status: 401 },
  FORBIDDEN: { title: 'Forbidden', status: 403 },
  BAD_USER_INPUT: { title: 'Bad Request', status: 400 },
}

// Apollo Server 4+ removed the ApolloError class hierarchy. GraphQL errors
// (including the ones our guards throw) are GraphQLError with a code in
// extensions.
@Catch(GraphQLError)
export class ApolloErrorFilter extends BaseProblemFilter {
  getProblem(error: GraphQLError) {
    const info =
      errorInfo[error.extensions?.code as string] ?? errorInfo.BAD_USER_INPUT
    return {
      ...info,
      type: `https://httpstatuses.org/${info.status}`,
      detail: error.message,
    } as HttpProblem
  }
}
