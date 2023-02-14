import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { CasesApi } from '@island.is/clients/consultation-portal'

import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CaseResult } from '../models/caseResult.model'
@Injectable()
export class CaseResultService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private caseApi: CasesApi,
  ) {}
  handleError(error: FetchError | ApolloError): void {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getAllCases(): Promise<CaseResult[]> {
    const cases = await this.getAllCases()
    return cases
  }
}
