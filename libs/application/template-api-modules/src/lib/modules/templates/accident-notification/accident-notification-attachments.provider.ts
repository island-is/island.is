import { Application, getValueViaPath } from '@island.is/application/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'
import path from 'path'
import {
  AccidentNotificationAttachment,
  AccidentNotificationAttachmentGatherRequest,
} from './types/attachments'

@Injectable()
export class AttachmentProvider {
  s3: S3
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    this.s3 = new S3()
  }

  async gatherAllAttachments(
    application: Application,
    gatherRequest: AccidentNotificationAttachmentGatherRequest[],
  ): Promise<AccidentNotificationAttachment[]> {
    try {
      const applicationAttachments = await this.prepareApplicationAttachments(
        application,
        gatherRequest,
      )
      return applicationAttachments
    } catch (error) {
      this.logger.error('Failed to gather attachments for application', {
        error,
      })
      throw error
    }
  }

  private async prepareApplicationAttachments(
    application: Application,
    gatherRequests: AccidentNotificationAttachmentGatherRequest[],
  ): Promise<AccidentNotificationAttachment[]> {
    const attachments = gatherRequests
      .map((x) => {
        const answers = getValueViaPath(
          application.answers,
          x.answerKey,
        ) as Array<{ key: string; name: string }>
        if (!answers) return []
        const res = answers.map((attachment) => {
          return {
            key: attachment.key,
            attachmentType: x.attachmentType,
            name: attachment.name,
            prefix: x.filenamePrefix,
          }
        })
        return res
      })
      .flat()

    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return []
    }

    const result = await Promise.all(
      attachments.map(async ({ key, name, attachmentType, prefix }) => {
        const url = (application.attachments as {
          [key: string]: string
        })[key]

        if (!url) {
          this.logger.info(`Failed to get url from application state ${name}`)
          return { name, content: '', attachmentType }
        }
        const { fileContent } = await this.getApplicationFilecontentAsBase64(
          url,
        )
        return {
          content: fileContent,
          attachmentType,
          name: this.formatFilename(key, name, prefix),
        }
      }),
    )
    return result.filter((x) => x.content !== '')
  }

  private formatFilename(key: string, name: string, prefix: string): string {
    const [guid = ''] = key.split('_')

    const fileEnding = path.extname(name)

    return `${guid}_${prefix}${fileEnding}`
  }

  private async getApplicationFilecontentAsBase64(
    fileName: string,
  ): Promise<{ fileName: string; fileContent: string; type: string }> {
    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    const file = await this.s3
      .getObject({
        Bucket: uploadBucket,
        Key: key,
      })
      .promise()
    const fileContent = file.Body as Buffer

    return {
      fileContent: fileContent?.toString('base64') || '',
      fileName: key,
      type: file.ContentType ?? '',
    }
  }
}
