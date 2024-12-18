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
  ApplicationType as SecondarySchoolApplicationType,
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
    // If we are past the registration date for any of the selected programs, dont allow delete
    if (
      getEndOfDayUTC(getFirstRegistrationEndDate(application.answers)) <
      new Date()
    ) {
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
    const recipientList = getRecipients(application.answers)
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
    // Get clean array of contacts
    const contacts: ApplicationContact[] = []

    // Parents
    const parents =
      (application.externalData.nationalRegistryParents
        .data as NationalRegistryParent[]) || []
    const parentsAnswers =
      getValueViaPath<SecondarySchoolAnswers['custodians']>(
        application.answers,
        'custodians',
      ) || []
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
    const otherContacts =
      getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
        application.answers,
        'otherContacts',
      ) || []
    for (let i = 0; i < otherContacts.length; i++) {
      if (otherContacts[i].include) {
        contacts.push({
          nationalId: otherContacts[i].nationalId || '',
          name: otherContacts[i].name || '',
          phone: otherContacts[i].phone || '',
          email: otherContacts[i].email || '',
        })
      }
    }

    // Get list of selected school and program ids with priority
    const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
      application.answers,
      'selection',
    )
    const schools: ApplicationSelectionSchool[] = []
    let schoolPriority = 0
    if (selection?.first?.school?.id && selection?.first?.firstProgram?.id) {
      schools.push({
        priority: schoolPriority++,
        schoolId: selection?.first.school.id,
        programs: [
          {
            priority: 0,
            programId: selection?.first.firstProgram.id,
          },
          {
            priority: 1,
            programId: selection?.first.secondProgram?.include
              ? selection?.first.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: selection?.first.thirdLanguage?.code || undefined,
        nordicLanguageCode: selection?.first.nordicLanguage?.code || undefined,
        requestDormitory: selection?.first.requestDormitory?.includes(YES),
      })
    }
    if (
      selection?.second?.include &&
      selection?.second?.school?.id &&
      selection?.second?.firstProgram?.id
    ) {
      schools.push({
        priority: schoolPriority++,
        schoolId: selection?.second.school.id,
        programs: [
          {
            priority: 0,
            programId: selection?.second.firstProgram.id,
          },
          {
            priority: 1,
            programId: selection?.second.secondProgram?.include
              ? selection?.second.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: selection?.second.thirdLanguage?.code || undefined,
        nordicLanguageCode: selection?.second.nordicLanguage?.code || undefined,
        requestDormitory: selection?.second.requestDormitory?.includes(YES),
      })
    }
    if (
      selection?.third?.include &&
      selection?.third?.school?.id &&
      selection?.third?.firstProgram?.id
    ) {
      schools.push({
        priority: schoolPriority++,
        schoolId: selection?.third.school.id,
        programs: [
          {
            priority: 0,
            programId: selection?.third.firstProgram.id,
          },
          {
            priority: 1,
            programId: selection?.third.secondProgram?.include
              ? selection?.third.secondProgram.id || ''
              : '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: selection?.third.thirdLanguage?.code || undefined,
        nordicLanguageCode: selection?.third.nordicLanguage?.code || undefined,
        requestDormitory: selection?.third.requestDormitory?.includes(YES),
      })
    }

    const applicant = getValueViaPath<SecondarySchoolAnswers['applicant']>(
      application.answers,
      'applicant',
    )

    const applicationType = getValueViaPath<SecondarySchoolApplicationType>(
      application.answers,
      'applicationType.type',
    )

    const extraInformation = getValueViaPath<
      SecondarySchoolAnswers['extraInformation']
    >(application.answers, 'extraInformation')

    // Submit the application
    const applicationId = await this.secondarySchoolClient.create(auth, {
      nationalId: auth.nationalId,
      name: applicant?.name || '',
      phone: applicant?.phoneNumber || '',
      email: applicant?.email || '',
      address: applicant?.address || '',
      postalCode: applicant?.postalCode || '',
      city: applicant?.city || '',
      isFreshman: applicationType === SecondarySchoolApplicationType.FRESHMAN,
      contacts: contacts,
      schools: schools,
      nativeLanguageCode: extraInformation?.nativeLanguageCode,
      otherDescription: extraInformation?.otherDescription,
      attachments: await Promise.all(
        (extraInformation?.supportingDocuments || []).map(
          async (attachment) => {
            const fileContent = await this.getAttachmentAsBase64(
              application,
              attachment,
            )
            return { fileContent }
          },
        ),
      ),
    })

    // Send email to applicant and all contacts
    const recipientList = getRecipients(application.answers)
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
