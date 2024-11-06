import { Inject, Injectable } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { S3Service } from '@island.is/nest/aws'
import AmazonS3URI from 'amazon-s3-uri'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationFilesConfig } from './files.config'
import { ConfigType } from '@nestjs/config'

export interface AttachmentMetaData {
  s3key: string
  key: string
  bucket: string
  value: string
}

export interface AttachmentDeleteResult {
  failed: { [key: string]: string }
  success: boolean
  deleted: number
}

@Injectable()
export class FileService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(ApplicationFilesConfig.KEY)
    private config: ConfigType<typeof ApplicationFilesConfig>,
    private readonly s3Service: S3Service,
  ) {}

  async deleteAttachmentsForApplication(
    application: Pick<Application, 'id' | 'attachments'>,
  ): Promise<AttachmentDeleteResult> {
    let result: AttachmentDeleteResult = {
      failed: {},
      success: true,
      deleted: 0,
    }

    const applicationAttachments = application.attachments as {
      key: string
      name: string
    }

    const attachments = this.attachmentsToMetaDataArray(applicationAttachments)

    if (attachments) {
      for (const attachment of attachments) {
        const { key, s3key, bucket, value } = attachment

        try {
          this.logger.info(`Deleting attachment ${s3key} from bucket ${bucket}`)
          await this.s3Service.deleteObject({ bucket, key: s3key })
          result = {
            ...result,
            deleted: (result.deleted += 1),
          }
        } catch (error) {
          this.logger.error(
            `S3 object delete failed for application Id: ${application.id} and attachment key: ${key}`,
            error,
          )

          result = {
            ...result,
            failed: {
              ...result.failed,
              [key]: value,
            },
            success: false,
          }
        }
      }
    }
    return result
  }

  private attachmentsToMetaDataArray(
    attachments: object,
  ): AttachmentMetaData[] {
    const keys: AttachmentMetaData[] = []
    for (const [key, value] of Object.entries(attachments)) {
      const { key: sourceKey, bucket } = AmazonS3URI(value)
      keys.push({ key, s3key: sourceKey, bucket, value })
    }

    return keys
  }
}
