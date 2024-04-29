import { ApplicationTypes } from '@island.is/application/types'
import { InsurancestatementsApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { ApplicationAttachmentProvider } from './attachments/provider'
import {
  applicationToStudentApplication,
  applicationToTravellerApplication,
  getApplicantType,
} from './health-insurance-declaration.utils'
import { ApplicantType } from '@island.is/application/templates/health-insurance-declaration'

@Injectable()
export class HealthInsuranceDeclarationService extends BaseTemplateApiService {
  constructor(
    private insuranceStatementApi: InsurancestatementsApi,
    private attachmentProvider: ApplicationAttachmentProvider,
  ) {
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

  async getInsuranceStatementData(application: TemplateApiModuleActionProps) {
    const canApply = await this.canApply(application)
    const continents = await this.continents(application)
    const countries = await this.countries(application)

    return {
      canApply: canApply,
      continents: continents,
      countries: countries,
    }
  }

  async submitApplicaiton({ application, auth }: TemplateApiModuleActionProps) {
    // Different endpoints are used base on if applicant is a student or not
    const applicationType = getApplicantType(application)
    if (applicationType === ApplicantType.STUDENT) {
      const attachments = await this.attachmentProvider.getFiles(
        ['attachments.documents'],
        application,
      )
      const applicationStudentRequest = applicationToStudentApplication(
        application,
        attachments,
      )
      const response = await this.insuranceStatementsApiWithAuth(
        auth,
      ).insuranceStatementStudentApplication({
        minarsidurAPIModelsInsuranceStatementsStudentApplicationDTO:
          applicationStudentRequest,
      })
    } else {
      const applicationTravellerRequest =
        applicationToTravellerApplication(application)
      const response = await this.insuranceStatementsApiWithAuth(
        auth,
      ).insuranceStatementTouristApplication({
        minarsidurAPIModelsInsuranceStatementsTouristApplicationDTO:
          applicationTravellerRequest,
      })
    }
  }
}
