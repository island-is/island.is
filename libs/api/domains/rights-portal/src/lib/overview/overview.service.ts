import { Inject, Injectable } from '@nestjs/common'
import { OverviewApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { InsuranceErrorStatus } from './models/insuranceError.model'
import { InsuranceConfirmationResponse } from './models/insuranceConfirmation.response'
import { InsuranceOverviewResponse } from './models/insuranceOverview.response'
import { handle404 } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'rights-portal-overview'

@Injectable()
export class OverviewService {
  constructor(
    private api: OverviewApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getInsuranceConfirmation(
    user: User,
  ): Promise<InsuranceConfirmationResponse> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getInsuranceConfirmation()
        .catch(handle404)

      return {
        items: data ? [data] : [],
        errors: [],
      }
    } catch (error) {
      this.logger.error(`Failed to get insurance confirmation`, {
        ...error,
        category: LOG_CATEGORY,
      })
      return {
        items: [],
        errors: [
          {
            message: 'Internal service error',
            status: InsuranceErrorStatus.INTERNAL_SERVICE_ERROR,
          },
        ],
      }
    }
  }

  async getInsuranceOverview(user: User): Promise<InsuranceOverviewResponse> {
    try {
      const data = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getInsuranceOverview()
        .catch(handle404)

      return {
        items: data ? [data] : [],
        errors: [],
      }
    } catch (error) {
      this.logger.error(`Failed to get insurance overview`, {
        ...error,
        category: LOG_CATEGORY,
      })
      return {
        items: [],
        errors: [
          {
            message: error.message,
            status: InsuranceErrorStatus.INTERNAL_SERVICE_ERROR,
          },
        ],
      }
    }
  }
}
