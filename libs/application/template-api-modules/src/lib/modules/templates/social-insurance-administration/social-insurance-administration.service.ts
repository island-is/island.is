import { Inject, Injectable } from '@nestjs/common'

import { Application, ApplicationTypes } from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

import {
  ApplicationType,
  Employment,
  getApplicationAnswers,
  isEarlyRetirement,
  errorMessages,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  Attachment,
  AttachmentTypeEnum,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'
import { S3 } from 'aws-sdk'
import {
  getApplicationType,
  transformApplicationToOldAgePensionDTO,
} from './social-insurance-administration-utils'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'
import { result } from 'lodash'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class SocialInsuranceAdministrationService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {
    super('SocialInsuranceAdministration')
  }

  private async initAttachments(
    application: Application,
    id: string,
    type: AttachmentTypeEnum,
    attachments: FileType[],
  ): Promise<Attachment[]> {
    const result: Attachment[] = []

    for (const attachment of attachments) {
      const Key = `${application.id}/${attachment.key}`
      const pdf = await this.getPdf(Key)

      result.push({
        name: attachment.name,
        type: type,
        file: pdf,
      })
    }

    return result
  }

  private async getAdditionalAttachments(application: Application): Promise<Array<Attachment>> {
    const { additionalAttachmentsRequired } = getApplicationAnswers(application.answers)

    console.log('additionalAttachmentsRequired ', additionalAttachmentsRequired)
    
    const attachments: Array<Attachment> = []

    if (additionalAttachmentsRequired && additionalAttachmentsRequired.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'fileUploadAdditionalFiles.additionalDocuments',
          AttachmentTypeEnum.PDF,
          additionalAttachmentsRequired,
        )),
      )
    }

    return attachments
  }

  private async getAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      pensionAttachments,
      fishermenAttachments,
      selfEmployedAttachments,
      earlyRetirementAttachments,
      applicationType,
      employmentStatus,
    } = getApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'fileUploadAdditionalFiles.additionalDocuments',
          AttachmentTypeEnum.Other,
          additionalAttachments,
        )),
      )
    }

    if (pensionAttachments && pensionAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'fileUpload.pension',
          AttachmentTypeEnum.Pension,
          pensionAttachments,
        )),
      )
    }

    if (
      fishermenAttachments &&
      fishermenAttachments.length > 0 &&
      applicationType === ApplicationType.SAILOR_PENSION
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'fileUpload.fishermen',
          AttachmentTypeEnum.Sailor,
          fishermenAttachments,
        )),
      )
    }

    if (
      selfEmployedAttachments &&
      selfEmployedAttachments.length > 0 &&
      employmentStatus === Employment.SELFEMPLOYED
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'employment.selfEmployedAttachment',
          AttachmentTypeEnum.SelfEmployed,
          selfEmployedAttachments,
        )),
      )
    }

    if (
      isEarlyRetirement(application.answers, application.externalData) &&
      earlyRetirementAttachments &&
      earlyRetirementAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          'fileUpload.earlyRetirement',
          AttachmentTypeEnum.Retirement,
          earlyRetirementAttachments,
        )),
      )
    }

    return attachments
  }

  async getPdf(key: string) {
    const file = await this.s3
      .getObject({ Bucket: this.attachmentBucket, Key: key })
      .promise()
    const fileContent = file.Body as Buffer

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    return fileContent.toString('base64')
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      const attachments = await this.getAttachments(application)

      const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
        application,
        attachments,
      )

      const applicationType = getApplicationType(application).toLowerCase()

      const response = await this.siaClientService.sendApplication(
        auth,
        oldAgePensionDTO,
        applicationType,
      )
      return response
    }
  }

  async sendDocuments({ application, auth }: TemplateApiModuleActionProps) {
    const attachments = await this.getAdditionalAttachments(application)

    console.log('documentsDTO ', attachments)
    const response = await this.siaClientService.sendAdditionalDocuments(auth, application.id, attachments)
    return response
    //throw Error()
  }

  async getApplicant({ auth }: TemplateApiModuleActionProps) {
    const res = await this.siaClientService.getApplicant(auth)

    // mock data since gervimenn don't have bank account registered at TR,
    // and might also not have phone number and email address registered
    if (isRunningOnEnvironment('local')) {
      if (res.bankAccount) {
        res.bankAccount.bank = '2222'
        res.bankAccount.ledger = '00'
        res.bankAccount.accountNumber = '123456'
      }

      if (!res.emailAddress) {
        res.emailAddress = 'mail@mail.is'
      }

      if (!res.phoneNumber) {
        res.phoneNumber = '888-8888'
      }
    }

    if (!res.emailAddress) {
      throw new TemplateApiError(
        {
          title: errorMessages.noEmailFound,
          summary: errorMessages.noEmailFoundDescription,
        },
        500,
      )
    }

    return res
  }

  async getIsEligible({ application, auth }: TemplateApiModuleActionProps) {
    if (isRunningOnEnvironment('local')) {
      return { isEligible: true }
    }
    const applicationType = getApplicationType(application).toLowerCase()
    return await this.siaClientService.getIsEligible(auth, applicationType)
  }

  async getCurrencies({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCurrencies(auth)
  }
}
