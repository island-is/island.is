import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'

import { ParentalLeaveApi } from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Application, getValueViaPath } from '@island.is/application/core'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { transformApplicationToParentalLeaveDTO } from './parental-leave.utils'

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

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const isSelfEmployed =
      getValueViaPath(application.answers, 'employer.isSelfEmployed') === 'yes'
    const attachment = isSelfEmployed
      ? await this.getSelfEmployedPdf(application)
      : undefined

    try {
      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        attachment,
      )

      const response = await this.parentalLeaveApi.parentalLeaveSetParentalLeave(
        {
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        },
      )

      if (response.id !== null) {
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedEmail,
          application,
        )
      } else {
        throw new Error(`Failed to send application: ${response.status}`)
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send application', e)
      throw e
    }
  }
}
