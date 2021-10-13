import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Response } from 'express'
import { Problem } from '@island.is/shared/problem'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ProblemError } from './ProblemError'

export abstract class BaseProblemFilter implements ExceptionFilter {
  protected readonly logger: Logger

  constructor(@Inject(LOGGER_PROVIDER) logger: Logger) {
    this.logger = logger.child({ context: 'ErrorFilter' })
  }

  catch(error: Error, host: ArgumentsHost) {
    if ((host.getType() as string) === 'graphql') {
      this.catchGraphQLError(error)
    } else {
      this.catchRestError(error, host)
    }
  }

  catchGraphQLError(error: Error) {
    const problem = (error as ProblemError).problem || this.getProblem(error)

    if (error instanceof ApolloError) {
      error.extensions.problem = error.extensions.problem || problem
      throw error
    } else {
      throw new ApolloError(problem.title, problem.type, { problem })
    }
  }

  catchRestError(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const problem = this.getProblem(error)

    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(problem.status || 500).json(problem)
  }

  abstract getProblem(error: Error): Problem
}
