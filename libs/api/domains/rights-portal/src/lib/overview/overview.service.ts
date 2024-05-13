import { Injectable } from '@nestjs/common'
import { OverviewApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { InsuranceErrorStatus } from './models/insuranceError.model'
import { InsuranceConfirmationResponse } from './models/insuranceConfirmation.response'
import { InsuranceOverviewResponse } from './models/insuranceOverview.response'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class OverviewService {
  constructor(private api: OverviewApi) {}

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
