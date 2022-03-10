import { Inject, Injectable } from '@nestjs/common'
import { ApplicationWithAttachments } from '@island.is/application/core'
import {
  BaseTemplateApiApplicationService,
  TemplateAPIConfig,
} from '@island.is/application/template-api-modules'
import { ApplicationService } from '@island.is/application/api/core'
import { AwsService } from '@island.is/nest/aws'
import { ConfigService } from '@nestjs/config'
import { uuid } from 'uuidv4'

@Injectable()
export class TemplateApiApplicationService extends BaseTemplateApiApplicationService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly awsService: AwsService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<TemplateAPIConfig>,
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
    const uploadBucket = this.configService.get('attachmentBucket') as string
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
