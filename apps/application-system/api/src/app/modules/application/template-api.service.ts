import { Inject, Injectable } from '@nestjs/common'
import { uuid } from 'uuidv4'

import { ApplicationWithAttachments } from '@island.is/application/core'
import { BaseTemplateApiApplicationService } from '@island.is/application/template-api-modules'

import type { ApplicationConfig } from './application.configuration'
import { APPLICATION_CONFIG } from './application.configuration'
import { ApplicationService } from './application.service'
import { AwsService } from './files'

@Injectable()
export class TemplateApiApplicationService extends BaseTemplateApiApplicationService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly awsService: AwsService,
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
  ) {
    super()
  }

  async saveAttachmentToApplicaton(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    const uploadBucket = this.config.attachmentBucket
    if (!uploadBucket) throw new Error('No attachment bucket configured')

    const fileId = uuid()
    const attachmentKey = `${fileId}-${fileName}`
    const s3key = `${application.id}/${attachmentKey}`
    const url = await this.awsService.uploadFile(
      buffer,
      uploadBucket,
      s3key,
      uploadParameters,
    )

    await this.applicationService.update(application.id, {
      attachments: {
        ...application.attachments,
        [attachmentKey]: url,
      },
    })

    return attachmentKey
  }
}
