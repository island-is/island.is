import { ApplicationTypes } from '@island.is/application/types'
import {
  InsurancestatementsApi,
  MinarsidurAPIModelsInsuranceStatementsResponseInsuranceStatementApplicationResponseDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { HttpException, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { ApplicationAttachmentProvider } from './attachments/provider'
import {
  applicationToStudentApplication,
  applicationToTouristApplication,
  getApplicantInsuranceStatus,
  getApplicantType,
  getApplicantsFromExternalData,
  getPersonsFromExternalData,
} from './health-insurance-declaration.utils'
import { ApplicantType } from './consts'

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
    return !!response.canApply
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

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    // Different endpoints are used base on if applicant is a student or not
    const applicationType = getApplicantType(application)
    let response: MinarsidurAPIModelsInsuranceStatementsResponseInsuranceStatementApplicationResponseDTO
    if (applicationType === ApplicantType.STUDENT) {
      const attachments = await this.attachmentProvider.getFiles(
        ['attachments.documents'],
        application,
      )
      const applicationStudentRequest = applicationToStudentApplication(
        application,
        attachments,
      )
      response = await this.insuranceStatementsApiWithAuth(
        auth,
      ).insuranceStatementStudentApplication({
        minarsidurAPIModelsInsuranceStatementsStudentApplicationDTO:
          applicationStudentRequest,
      })
    } else {
      const applicationTouristRequest =
        applicationToTouristApplication(application)
      response = await this.insuranceStatementsApiWithAuth(
        auth,
      ).insuranceStatementTouristApplication({
        minarsidurAPIModelsInsuranceStatementsTouristApplicationDTO:
          applicationTouristRequest,
      })
    }
    if (!response.success) {
      throw new HttpException(
        response.errorMessage ?? 'Error when submitting application',
        500,
      )
    }
    return response
  }

  async getPdfDataForApplicants({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const persons = getPersonsFromExternalData(application)
    const applicants = getApplicantsFromExternalData(application)
    const applicantsWithPdfData = []

    if (!applicants) {
      throw new HttpException('No applicants for application', 500)
    }

    const isApplicantInsured = getApplicantInsuranceStatus(application)

    /* If the applicant does not qualify for health insurance declaration
       explicitily add the applicant to the return array to clarify.
    */
    if (!isApplicantInsured) {
      applicantsWithPdfData.push({
        applicantName: persons[0].name,
        nationalId: persons[0].nationalId,
        comment: 'Á ekki rétt á tryggingaryfirlýsingu',
        approved: false,
      })
    }

    for (const applicant of applicants) {
      let pdfDataResponse
      const person = persons.find((p) => p.nationalId === applicant.nationalId)
      if (!person) {
        throw new HttpException('Applicant data not found', 500)
      }
      if (applicant.approved) {
        pdfDataResponse = await this.insuranceStatementsApiWithAuth(
          auth,
        ).getInsuranceStatementPdf({ documentId: applicant.documentId })
      }

      applicantsWithPdfData.push({
        applicantName: person.name,
        nationalId: person.nationalId,
        pdfData: pdfDataResponse,
        comment: applicant.comment,
        approved: applicant.approved,
      })
    }
    return applicantsWithPdfData
  }
}
