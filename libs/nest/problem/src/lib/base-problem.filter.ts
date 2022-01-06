import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Response } from 'express'
import { Problem } from '@island.is/shared/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ProblemError } from './ProblemError'
import { PROBLEM_OPTIONS, ProblemOptions } from './problem.options'

export abstract class BaseProblemFilter implements ExceptionFilter {
  private readonly logger: Logger

  constructor(
    @Inject(PROBLEM_OPTIONS)
    private readonly options: ProblemOptions,
    @Inject(LOGGER_PROVIDER) logger: Logger,
  ) {
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

    if (problem.status && problem.status >= 500) {
      this.logger.error(error)
    } else if (this.options.logAllErrors) {
      this.logger.info(error)
    }

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

    if (problem.status && problem.status >= 500) {
      this.logger.error(error)
    } else if (this.options.logAllErrors) {
      this.logger.info(error)
    }

    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(problem.status || 500)
    response.statusMessage = problem.title
    response.json(problem)
  }

  abstract getProblem(error: Error): Problem
}
