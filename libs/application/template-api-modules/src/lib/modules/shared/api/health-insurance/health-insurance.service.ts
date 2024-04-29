import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { HealthcenterApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class HealthInsuranceService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private healthcenterApi: HealthcenterApi,
  ) {
    super('Healthcenter')
    this.logger = logger.child({ context: 'HealthInsuranceService' })
  }

  private healthcenterApiWithAuth(auth: Auth) {
    return this.healthcenterApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentHealthcenter({ auth }: TemplateApiModuleActionProps) {
    try {
      const healthCenter = await this.healthcenterApiWithAuth(
        auth,
      ).getCurrentHealthCenter()

      return healthCenter
    } catch (error) {
      this.logger.error('Failed getting current health center', error)
      return null
    }
  }
}
