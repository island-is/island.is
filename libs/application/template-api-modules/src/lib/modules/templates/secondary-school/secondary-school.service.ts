import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  ApplicationType as SecondarySchoolApplicationType,
  SecondarySchoolAnswers,
} from '@island.is/application/templates/secondary-school'
import {
  ApplicationPeriod,
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
  generateApplicationDeletedEmail,
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

  async getApplicationPeriodInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<ApplicationPeriod> {
    return this.secondarySchoolClient.getApplicationPeriodInfo(auth)
  }

  async getStudentInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<Student> {
    const result = await this.secondarySchoolClient.getStudentInfo(auth)

    if (result.hasActiveApplication) {
      throw new TemplateApiError(
        {
          title: error.errorValidateCanCreateTitle,
          summary: error.errorValidateCanCreateDescription,
        },
        400,
      )
    }

    return result
  }

  async getSchools({
    auth,
  }: TemplateApiModuleActionProps): Promise<SecondarySchool[]> {
    const periodInfo =
      await this.secondarySchoolClient.getApplicationPeriodInfo(auth)
    const studentInfo = await this.secondarySchoolClient.getStudentInfo(auth)
    const schools = await this.secondarySchoolClient.getSchools(auth)

    let schoolIsOpenForAdmission: boolean
    if (!periodInfo?.allowFreshmanApplication) {
      schoolIsOpenForAdmission = !!schools.find(
        (x) => x.isOpenForAdmissionGeneral,
      )
    } else if (studentInfo?.isFreshman) {
      schoolIsOpenForAdmission = !!schools.find(
        (x) => x.isOpenForAdmissionFreshman,
      )
    } else {
      schoolIsOpenForAdmission = !!schools.find(
        (x) => x.isOpenForAdmissionFreshman || x.isOpenForAdmissionGeneral,
      )
    }

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

  async deleteApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const externalId = await this.secondarySchoolClient.getExternalId(
      auth,
      application.id,
    )

    if (externalId) {
      try {
        // Delete the application in MMS
        await this.secondarySchoolClient.delete(auth, application.id)

        try {
          // If that succeeded, send email to applicant and custodians
          await this.sendEmailAboutDeleteApplication(application)
        } catch (emailError) {
          logger.error(
            `Application deleted but failed to send notification emails: ${emailError.message}`,
            { applicationId: application.id },
          )
        }
      } catch (error) {
        throw new Error(
          `Failed to delete application ${application.id}: ${error.message}`,
        )
      }
    }
  }

  private async sendEmailAboutDeleteApplication(
    application: ApplicationWithAttachments,
  ) {
    const recipientList = getRecipients(application).filter((x) => !!x.email)
    await Promise.all(
      recipientList.map((recipient) =>
        this.sharedTemplateAPIService
          .sendEmail(
            (props) => generateApplicationDeletedEmail(props, recipient),
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
    // Get external id
    const externalId = await this.secondarySchoolClient.getExternalId(
      auth,
      application.id,
    )

    // Validate if user can submit application (has another active application)
    const studentInfo = await this.secondarySchoolClient.getStudentInfo(auth)
    if (
      studentInfo.hasActiveApplication &&
      (!externalId || !studentInfo.externalIds.includes(externalId))
    ) {
      throw new TemplateApiError(
        {
          title: error.errorValidateCanCreateTitle,
          summary: error.errorValidateCanCreateDescription,
        },
        400,
      )
    }

    try {
      // Get values from externalData
      const nationalRegistryData = getValueViaPath<NationalRegistryIndividual>(
        application.externalData,
        'nationalRegistry.data',
      )

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
      const applicationId = await this.secondarySchoolClient.createOrUpdate(
        auth,
        {
          externalId,
          id: application.id,
          nationalId: auth.nationalId,
          name: applicant?.name || '',
          genderCode: nationalRegistryData?.genderCode,
          phone: applicant?.phoneNumber || '',
          email: applicant?.email || '',
          address: applicant?.address || '',
          postalCode: applicant?.postalCode || '',
          city: applicant?.city || '',
          isFreshman:
            applicationType === SecondarySchoolApplicationType.FRESHMAN,
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
                const contentType = this.getMimeType(
                  attachment.name.split('.').pop(),
                )
                return {
                  fileName: attachment.name,
                  fileContent,
                  contentType,
                }
              },
            ),
          ),
        },
      )

      // Send email to applicant and all contacts
      await this.sendEmailAboutSubmitApplication(application)

      return applicationId
    } catch (e) {
      throw new TemplateApiError(
        {
          title: error.errorSubmitApplicationTitle,
          summary: error.errorSubmitApplicationDescription,
        },
        500,
      )
    }
  }

  private async sendEmailAboutSubmitApplication(
    application: ApplicationWithAttachments,
  ) {
    // Send email to applicant and all contacts
    const recipientList = getRecipients(application)
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

  private getMimeType(extension?: string): string {
    const fileExtensionWhitelist = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    }

    const contentType =
      extension &&
      getValueViaPath<string>(
        fileExtensionWhitelist,
        `.${extension.toLowerCase()}`,
      )

    if (!contentType) {
      throw new Error(`Invalid extension in attachment: ${extension}`)
    }

    return contentType
  }
}
