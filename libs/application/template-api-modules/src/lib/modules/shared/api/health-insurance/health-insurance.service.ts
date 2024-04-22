import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { HealthcenterApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'

@Injectable()
export class HealthInsuranceService extends BaseTemplateApiService {
  constructor(private healthcenterApi: HealthcenterApi) {
    super('Healthcenter')
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
      return null
    }
  }
}
