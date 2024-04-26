import { ApplicationTypes } from '@island.is/application/types'
import { InsurancestatementsApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'

@Injectable()
export class HealthInsuranceDeclarationService extends BaseTemplateApiService {
  constructor(private insuranceStatementApi: InsurancestatementsApi) {
    super(ApplicationTypes.HEALTH_INSURANCE_DECLARATION)
  }

  private insuranceStatementsApiWithAuth(Auth: Auth) {
    return this.insuranceStatementApi.withMiddleware(new AuthMiddleware(Auth))
  }

  async canApply(application: TemplateApiModuleActionProps): Promise<boolean> {
    const response = await this.insuranceStatementsApiWithAuth(
      application.auth,
    ).getInsuranceStatementStatus({
      applicantNationalId: application.auth.nationalId,
    })
    if (response.canApply) {
      return true
    }
    return false
  }

  async continents(application: TemplateApiModuleActionProps) {
    return await this.insuranceStatementsApiWithAuth(
      application.auth,
    ).getInsuranceStatementContinents()
  }

  async countries(application: TemplateApiModuleActionProps) {
    return await this.insuranceStatementsApiWithAuth(
      application.auth,
    ).getInsuranceStatementCountries()
  }

  async insuranceStatementData(application: TemplateApiModuleActionProps) {
    const canApply = await this.canApply(application)
    const continents = await this.continents(application)
    const countries = await this.countries(application)

    return {
      canApply: canApply,
      continents: continents,
      countries: countries,
    }
  }
}
