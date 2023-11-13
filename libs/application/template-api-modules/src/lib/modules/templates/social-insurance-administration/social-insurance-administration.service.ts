import { Inject, Injectable } from '@nestjs/common'

import {
  Application,
  ApplicationTypes,
  YES,
} from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationType,
  Employment,
  getApplicationAnswers,
  isEarlyRetirement,
  oldAgePensionFormMessage,
  FileType,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  Attachment,
  OldAgePensionResponseError,
  SocialInsuranceAdministrationClientService,
  Uploads,
} from '@island.is/clients/social-insurance-administration'
import { S3 } from 'aws-sdk'
import {
  getApplicationType,
  transformApplicationToOldAgePensionDTO,
} from './social-insurance-administration-utils'
import { coreErrorMessages } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class OldAgePensionService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {
    super(ApplicationTypes.OLD_AGE_PENSION)
  }

  private parseErrors(e: Error | OldAgePensionResponseError) {
    if (e instanceof Error) {
      return e.message
    }

    return { message: e.message }
  }

  private async initAttachments(
    application: Application,
    id: string,
    type: string,
    attachments: FileType[],
  ): Promise<Attachment[]> {
    const result: Attachment[] = []

    for (let i = 0; i <= attachments.length - 1; i++) {
      const pdf = await this.getPdf(application, i, id)
      result.push({
        name: attachments[i].name,
        type: type,
        file: pdf,
      })
    }

    return result
  }

  private async getAttachments(application: Application): Promise<Uploads> {
    const {
      additionalAttachments,
      pensionAttachments,
      fishermenAttachments,
      selfEmployedAttachments,
      earlyRetirementAttachments,
      applicationType,
      employmentStatus,
    } = getApplicationAnswers(application.answers)

    const uploads: Uploads = {}

    if (additionalAttachments && additionalAttachments.length > 0) {
      uploads.additional = await this.initAttachments(
        application,
        'fileUploadAdditionalFiles.additionalDocuments',
        'other',
        additionalAttachments,
      )
    }

    if (pensionAttachments && pensionAttachments.length > 0) {
      uploads.pension = await this.initAttachments(
        application,
        'fileUpload.pension',
        'pension',
        pensionAttachments,
      )
    }

    if (
      fishermenAttachments &&
      fishermenAttachments.length > 0 &&
      applicationType === ApplicationType.SAILOR_PENSION
    ) {
      uploads.sailorPension = await this.initAttachments(
        application,
        'fileUpload.fishermen',
        'sailor',
        fishermenAttachments,
      )
    }

    if (
      selfEmployedAttachments &&
      selfEmployedAttachments.length > 0 &&
      employmentStatus === Employment.SELFEMPLOYED
    ) {
      uploads.halfOldAgePension = await this.initAttachments(
        application,
        'employment.selfEmployedAttachment',
        'selfEmployed',
        selfEmployedAttachments,
      )
    }

    if (
      isEarlyRetirement(application.answers, application.externalData) &&
      earlyRetirementAttachments &&
      earlyRetirementAttachments.length > 0
    ) {
      uploads.earlyRetirement = await this.initAttachments(
        application,
        'fileUpload.earlyRetirement',
        'earlyRetirement',
        earlyRetirementAttachments,
      )
    }

    return uploads
  }

  async getPdf(application: Application, index = 0, fileUpload: string) {
    try {
      const filename = getValueViaPath(
        application.answers,
        fileUpload + `[${index}].key`,
      )

      const Key = `${application.id}/${filename}`

      const file = await this.s3
        .getObject({ Bucket: this.attachmentBucket, Key })
        .promise()
      const fileContent = file.Body as Buffer

      if (!fileContent) {
        throw new Error('File content was undefined')
      }

      return fileContent.toString('base64')
    } catch (e) {
      this.logger.error('Cannot get ' + fileUpload + ' attachment', { e })
      throw new Error('Failed to get the ' + fileUpload + ' attachment')
    }
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
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
    } catch (e) {
      this.logger.error('Failed to send the old age pension application', e)
      throw this.parseErrors(e)
    }
  }

  async getApplicant({ auth }: TemplateApiModuleActionProps) {
    const res = await this.siaClientService.getApplicant(auth).catch(() => {
      throw new TemplateApiError(coreErrorMessages.defaultTemplateApiError, 500)
    })

    // mock data since gervimenn don't have bank account registered at TR,
    // and might also not have phone number and email address registered
    if (isRunningOnEnvironment('local')) {
      res.bankAccount!.bank = '2222'
      res.bankAccount!.ledger = '00'
      res.bankAccount!.accountNumber = '123456'

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
          title: oldAgePensionFormMessage.errorMessages.noEmailFound,
          summary:
            oldAgePensionFormMessage.errorMessages.noEmailFoundDescription,
        },
        500,
      )
    }

    return res
  }

  async getIsEligible({ application, auth }: TemplateApiModuleActionProps) {
    try {
      if (isRunningOnEnvironment('local')) {
        return { isEligible: true }
      }
      const applicationType = getApplicationType(application).toLowerCase()
      return await this.siaClientService.getIsEligible(auth, applicationType)
    } catch (e) {
      throw new TemplateApiError(coreErrorMessages.defaultTemplateApiError, 500)
    }
  }
}
