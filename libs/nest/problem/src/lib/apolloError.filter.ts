import { Catch } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { HttpProblem } from '@island.is/shared/problem'
import { BaseProblemFilter } from './base-problem.filter'

const errorInfo: Record<string, { title: string, status: number }> = {
  // These titles are changed to be consistent with the default title for NestJS HttpException errors.
  UNAUTHENTICATED: { title: 'Unauthorized', status: 401 },
  FORBIDDEN: { title: 'Forbidden', status: 403 },
  BAD_USER_INPUT: { title: 'Bad Request', status: 400 },
}

@Catch(ApolloError)
export class ApolloErrorFilter extends BaseProblemFilter {
  getProblem(error: ApolloError) {
    const info = errorInfo[error.extensions.code] ?? errorInfo.BAD_USER_INPUT
    return {
      ...info,
      type: `https://httpstatuses.com/${info.status}`,
      detail: error.message,
    } as HttpProblem
  }
}
