import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryParent,
  YES,
} from '@island.is/application/types'
import {
  getEndOfDayUTC,
  getFirstRegistrationEndDate,
  SecondarySchoolAnswers,
} from '@island.is/application/templates/secondary-school'
import {
  ApplicationContact,
  ApplicationSelectionSchool,
  SecondarySchool,
  SecondarySchoolClient,
} from '@island.is/clients/secondary-school'
import { TemplateApiError } from '@island.is/nest/problem'
import { error } from '@island.is/application/templates/secondary-school'
import { S3Service } from '@island.is/nest/aws'
import { SharedTemplateApiService } from '../../shared'
import { logger } from '@island.is/logging'
import { getRecipients } from './utils'
import {
  generateApplicationRejectedEmail,
  generateApplicationSubmittedEmail,
} from './emailGenerators'

@Injectable()
export class SecondarySchoolService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly secondarySchoolClient: SecondarySchoolClient,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.SECONDARY_SCHOOL)
  }

  async getSchools({
    auth,
  }: TemplateApiModuleActionProps): Promise<SecondarySchool[]> {
    return this.secondarySchoolClient.getSchools(auth)
  }

  async validateCanCreate({
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const canCreate = this.secondarySchoolClient.validateCanCreate(auth)

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
    const answers = application.answers as SecondarySchoolAnswers

    // If we are past the registration date for any of the selected programs, dont allow delete
    //TODOx should rather trust validation from api (either separate endpoint or they throw error on delete),
    // in case user accidentally set applicationType=OTHER, and not FRESHMAN and it is june 1
    if (getEndOfDayUTC(getFirstRegistrationEndDate(answers)) < new Date()) {
      throw new TemplateApiError(
        {
          title: error.errorDeletePastRegistrationEndTitle,
          summary: error.errorDeletePastRegistrationEndDescription,
        },
        500,
      )
    }

    // Delete the application
    await this.secondarySchoolClient.delete(auth, application.id)

    // Send email to applicant and all contacts
    const recipientList = getRecipients(answers)
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationRejectedEmail(props, recipientList[i]),
            application,
          )
          .catch((e) => {
            logger.error(
              `Error sending email in deleteApplication for applicationID: ${application.id}`,
              e,
            )
          })
      }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<string> {
    const answers = application.answers as SecondarySchoolAnswers

    // Get clean array of contacts
    const contacts: ApplicationContact[] = []

    // Parents
    const parents =
      (application.externalData.nationalRegistryParents
        .data as NationalRegistryParent[]) || []
    const parentsAnswers = answers?.custodians || []
    for (let i = 0; i < parents.length; i++) {
      if (parents[i].nationalId) {
        contacts.push({
          nationalId: parents[i].nationalId,
          name: `${parents[i].givenName} ${parents[i].familyName}`,
          phone: parentsAnswers[i]?.phone || '',
          email: parentsAnswers[i]?.email || '',
          address: parents[i].legalDomicile?.streetAddress,
          postalCode: parents[i].legalDomicile?.postalCode || undefined,
          city: parents[i].legalDomicile?.locality || undefined,
        })
      }
    }

    // Other contacts
    const otherContacts = answers?.otherContacts || []
    for (let i = 0; i < otherContacts.length; i++) {
      if (otherContacts[i].include) {
        contacts.push({
          nationalId: answers.otherContacts[i].nationalId || '',
          name: answers.otherContacts[i].name || '',
          phone: answers.otherContacts[i].phone || '',
          email: answers.otherContacts[i].email || '',
        })
      }
    }

    // Get list of selected school and program ids with priority
    const schools: ApplicationSelectionSchool[] = []
    let schoolPriority = 0
    if (
      answers?.selection?.first?.school?.id &&
      answers?.selection?.first?.firstProgram?.id
    ) {
      schools.push({
        priority: schoolPriority++,
        schoolId: answers.selection.first.school.id,
        programs: [
          {
            priority: 0,
            programId: answers.selection.first.firstProgram.id,
          },
          {
            priority: 1,
            programId: answers.selection.first.secondProgram?.include
              ? answers.selection.first.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: answers.selection.first.thirdLanguage?.code,
        nordicLanguageCode: answers.selection.first.nordicLanguage?.code,
        requestDormitory:
          answers.selection.first.requestDormitory?.includes(YES),
      })
    }
    if (
      answers?.selection?.second?.include &&
      answers?.selection?.second?.school?.id &&
      answers?.selection?.second?.firstProgram?.id
    ) {
      schools.push({
        priority: schoolPriority++,
        schoolId: answers.selection.second.school.id,
        programs: [
          {
            priority: 0,
            programId: answers.selection.second.firstProgram.id,
          },
          {
            priority: 1,
            programId: answers.selection.second.secondProgram?.include
              ? answers.selection.second.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: answers.selection.second.thirdLanguage?.code,
        nordicLanguageCode: answers.selection.second.nordicLanguage?.code,
        requestDormitory:
          answers.selection.second.requestDormitory?.includes(YES),
      })
    }
    if (
      answers?.selection?.third?.include &&
      answers?.selection?.third?.school?.id &&
      answers?.selection?.third?.firstProgram?.id
    ) {
      schools.push({
        priority: schoolPriority++,
        schoolId: answers.selection.third.school.id,
        programs: [
          {
            priority: 0,
            programId: answers.selection.third.firstProgram.id,
          },
          {
            priority: 1,
            programId: answers.selection.third.secondProgram?.include
              ? answers.selection.third.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: answers.selection.third.thirdLanguage?.code,
        nordicLanguageCode: answers.selection.third.nordicLanguage?.code,
        requestDormitory:
          answers.selection.third.requestDormitory?.includes(YES),
      })
    }

    // get base64 for each attachment
    const attachments = await Promise.all(
      (answers?.extraInformation?.supportingDocuments || []).map(
        async (attachment) => {
          const fileContent = await this.getAttachmentAsBase64(
            application,
            attachment,
          )
          return { fileContent }
        },
      ),
    )

    // Submit the application
    const applicationId = await this.secondarySchoolClient.create(auth, {
      nationalId: auth.nationalId,
      name: answers?.applicant?.name,
      phone: answers?.applicant?.phoneNumber,
      email: answers?.applicant?.email,
      address: answers?.applicant?.address,
      postalCode: answers?.applicant?.postalCode,
      city: answers?.applicant?.city,
      contacts: contacts,
      schools: schools,
      nativeLanguageCode: answers?.extraInformation?.nativeLanguage,
      otherDescription: answers?.extraInformation?.otherDescription,
      attachments: attachments,
    })

    // Send email to applicant and all contacts
    const recipientList = getRecipients(answers)
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationSubmittedEmail(props, recipientList[i]),
            application,
          )
          .catch((e) => {
            logger.error(
              `Error sending email in submitApplication for applicationID: ${application.id}`,
              e,
            )
          })
      }
    }

    return applicationId
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
