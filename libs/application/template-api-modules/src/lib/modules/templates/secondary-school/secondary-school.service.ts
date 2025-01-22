import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  ApplicationType as SecondarySchoolApplicationType,
  SecondarySchoolAnswers,
} from '@island.is/application/templates/secondary-school'
import {
  SecondarySchool,
  SecondarySchoolClient,
  Student,
} from '@island.is/clients/secondary-school'
import { TemplateApiError } from '@island.is/nest/problem'
import { error } from '@island.is/application/templates/secondary-school'
import { S3Service } from '@island.is/nest/aws'
import { SharedTemplateApiService } from '../../shared'
import { logger } from '@island.is/logging'
import {
  getCleanContacts,
  getCleanSchoolSelection,
  getRecipients,
} from './utils'
import {
  generateApplicationRejectedEmail,
  generateApplicationSubmittedEmail,
} from './emailGenerators'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class SecondarySchoolService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly secondarySchoolClient: SecondarySchoolClient,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.SECONDARY_SCHOOL)
  }

  async getStudentInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<Student> {
    return this.secondarySchoolClient.getStudentInfo(auth)
  }

  async getSchools({
    auth,
  }: TemplateApiModuleActionProps): Promise<SecondarySchool[]> {
    const studentInfo = await this.secondarySchoolClient.getStudentInfo(auth)
    const schools = await this.secondarySchoolClient.getSchools(auth)

    const schoolIsOpenForAdmission = schools.find((x) =>
      studentInfo?.isFreshman
        ? x.isOpenForAdmissionFreshman
        : x.isOpenForAdmissionFreshman || x.isOpenForAdmissionGeneral,
    )
    if (!schoolIsOpenForAdmission) {
      throw new TemplateApiError(
        {
          title: error.errorNoSchoolOpenForAdmissionTitle,
          summary: error.errorNoSchoolOpenForAdmissionDescription,
        },
        400,
      )
    }

    return schools
  }

  async validateCanCreate({
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const canCreate = await this.secondarySchoolClient.validateCanCreate(auth)

    if (!canCreate) {
      throw new TemplateApiError(
        {
          title: error.errorValidateCanCreateTitle,
          summary: error.errorValidateCanCreateDescription,
        },
        400,
      )
    }
  }

  async deleteApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const externalApplicationId = getValueViaPath<string>(
      application.externalData,
      'submitApplication.data',
    )
    if (externalApplicationId) {
      // Delete the application in MMS
      await this.secondarySchoolClient.delete(auth, externalApplicationId)

      // If that succeeded, send email to applicant and custodians
      await this.sendEmailAboutDeleteApplication(application)
    }
  }

  private async sendEmailAboutDeleteApplication(
    application: ApplicationWithAttachments,
  ) {
    const recipientList = getRecipients(application.answers).filter(
      (x) => !!x.email,
    )
    await Promise.all(
      recipientList.map((recipient) =>
        this.sharedTemplateAPIService
          .sendEmail(
            (props) => generateApplicationRejectedEmail(props, recipient),
            application,
          )
          .catch((e) => {
            logger.error(
              `Error sending email in deleteApplication for applicationID: ${application.id}`,
              e,
            )
          }),
      ),
    )
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<string> {
    const nationalId = auth.actor?.nationalId || auth.nationalId

    // Get values from answers
    const applicant = getValueViaPath<SecondarySchoolAnswers['applicant']>(
      application.answers,
      'applicant',
    )
    const applicationType = getValueViaPath<SecondarySchoolApplicationType>(
      application.answers,
      'applicationType.value',
    )
    const contacts = getCleanContacts(application)
    const schoolSelection = getCleanSchoolSelection(application)
    const extraInformation = getValueViaPath<
      SecondarySchoolAnswers['extraInformation']
    >(application.answers, 'extraInformation')

    // Submit the application
    let applicationId: string | undefined
    try {
      applicationId = await this.secondarySchoolClient.create(auth, {
        id: application.id,
        nationalId: nationalId,
        name: applicant?.name || '',
        phone: applicant?.phoneNumber || '',
        email: applicant?.email || '',
        address: applicant?.address || '',
        postalCode: applicant?.postalCode || '',
        city: applicant?.city || '',
        isFreshman: applicationType === SecondarySchoolApplicationType.FRESHMAN,
        contacts: contacts,
        schools: schoolSelection,
        nativeLanguageCode: extraInformation?.nativeLanguageCode || undefined,
        otherDescription: extraInformation?.otherDescription,
        attachments: await Promise.all(
          (extraInformation?.supportingDocuments || []).map(
            async (attachment) => {
              const fileContent = await this.getAttachmentAsBase64(
                application,
                attachment,
              )
              return {
                fileName: attachment.name,
                fileContent,
                contentType: `application/${attachment.name.split('.').pop()}`,
              }
            },
          ),
        ),
      })
    } catch (e) {
      throw new TemplateApiError(
        {
          title: error.errorSubmitApplicationTitle,
          summary: error.errorSubmitApplicationDescription,
        },
        500,
      )
    }

    // Send email to applicant and all contacts
    await this.sendEmailAboutSubmitApplication(application)

    return applicationId
  }

  private async sendEmailAboutSubmitApplication(
    application: ApplicationWithAttachments,
  ) {
    // Send email to applicant and all contacts
    const recipientList = getRecipients(application.answers)
    await Promise.all(
      recipientList.map((recipient) =>
        this.sharedTemplateAPIService
          .sendEmail(
            (props) => generateApplicationSubmittedEmail(props, recipient),
            application,
          )
          .catch((e) => {
            logger.error(
              `Error sending email in submitApplication for applicationID: ${application.id}`,
              e,
            )
          }),
      ),
    )
  }

  private async getAttachmentAsBase64(
    application: ApplicationWithAttachments,
    attachment: {
      key: string
      name: string
    },
  ): Promise<string> {
    const attachmentKey = attachment.key

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      throw new Error(
        `Attachment filename not found in application on attachment key: ${attachmentKey}`,
      )
    }

    try {
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )

      if (!fileContent) {
        throw new Error(`File content not found for: ${fileName}`)
      }

      return fileContent
    } catch (error) {
      throw new Error(`Failed to retrieve attachment: ${error.message}`)
    }
  }
}
