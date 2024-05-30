import { Injectable, Inject } from '@nestjs/common'
import { OverviewApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { InsuranceConfirmation } from './models/insuranceConfirmation.model'
import { InsuranceOverview } from './models/insuranceOverview.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { InsuranceStatusType } from './overview.types'

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
  ): Promise<InsuranceConfirmation | null> {
    const data = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getInsuranceConfirmation()
      .catch(handle404)
    if (!data) {
      return null
    }

    if (!data.fileName || !data.contentType || !data.data) {
      this.logger.warn('Missing data from external service', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return {
      data: data.data,
      fileName: data.fileName,
      contentType: data.contentType,
    }
  }

  async getInsuranceOverview(user: User): Promise<InsuranceOverview> {
    const data = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getInsuranceOverview()
      .catch(handle404)

    if (!data) {
      return {
        isInsured: false,
      }
    }

    const codeEnum: InsuranceStatusType | undefined =
      data.status?.code && data.status.code in InsuranceStatusType
        ? InsuranceStatusType[
            data.status.code as keyof typeof InsuranceStatusType
          ]
        : undefined

    return {
      isInsured: !!data.isInsured,
      explanation: data.explanation ?? '',
      from: data.from ?? undefined,
      maximumPayment: data.maximumPayment,
      ehicCardExpiryDate: data.ehicCardExpiryDate ?? undefined,
      status: {
        display: data.status?.display,
        code: codeEnum,
      },
    }
  }
}
