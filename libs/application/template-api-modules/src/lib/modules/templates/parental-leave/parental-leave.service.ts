import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'

import type { Attachment } from '@island.is/clients/vmst'
import { ParentalLeaveApi } from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Application, getValueViaPath } from '@island.is/application/core'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateApplicationApprovedByEmployerEmail,
} from './emailGenerators'
import {
  getEmployer,
  transformApplicationToParentalLeaveDTO,
} from './parental-leave.utils'
import { apiConstants, formConstants } from './constants'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class ParentalLeaveService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {}

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
    )
  }

  async getSelfEmployedPdf(application: Application) {
    try {
      const filename = getValueViaPath(
        application.answers,
        'employer.selfEmployed.file[0].key',
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
      this.logger.error('Cannot get self employed attachment', { e })
      throw new Error('Failed to get the self employed attachment')
    }
  }

  async getAttachments(application: Application): Promise<Attachment[]> {
    const attachments: Attachment[] = []
    const isSelfEmployed =
      getValueViaPath(application.answers, 'employer.isSelfEmployed') ===
      formConstants.boolean.true

    if (isSelfEmployed) {
      const pdf = await this.getSelfEmployedPdf(application)

      attachments.push({
        attachmentType: apiConstants.attachments.selfEmployed,
        attachmentBytes: pdf,
      })
    }

    return attachments
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const attachments = await this.getAttachments(application)

    try {
      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        attachments,
      )

      const response = await this.parentalLeaveApi.parentalLeaveSetParentalLeave(
        {
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        },
      )

      if (!response.id) {
        throw new Error(`Failed to send application: ${response.status}`)
      }

      const employer = getEmployer(application)
      const isEmployed = employer.nationalRegistryId !== application.applicant

      if (isEmployed) {
        // Only needs to send an email if being approved by employer
        // If self employed applicant was aware of the approval
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedByEmployerEmail,
          application,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send application', e)
      throw e
    }
  }
}
