import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { SocialInsuranceAdministrationRepository } from './social-insurance-administration.repository'

@Injectable()
export class SocialInsuranceAdministrationService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private socialInsuranceAdministrationRepository: SocialInsuranceAdministrationRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getCurrencies(): Promise<Array<string>> {
    return await this.socialInsuranceAdministrationRepository
      .getCurrencies()
      .catch(this.handleError.bind(this))
  }
}
