import { Catch, HttpException } from '@nestjs/common'
import { BaseProblemFilter } from './base-problem.filter'
import { HttpProblem } from '@island.is/shared/problem'

type ErrorResponse = string | { message: string; error?: string }

@Catch(HttpException)
export class HttpExceptionFilter extends BaseProblemFilter {
  getProblem(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as ErrorResponse
    if (typeof response === 'string') {
      return {
        status,
        type: `https://httpstatuses.com/${status}`,
        title: response,
      } as HttpProblem
    }
    return {
      status,
      type: `https://httpstatuses.com/${status}`,
      title: response.error || response.message,
      detail: response.error ? response.message : undefined,
    } as HttpProblem
  }
}
