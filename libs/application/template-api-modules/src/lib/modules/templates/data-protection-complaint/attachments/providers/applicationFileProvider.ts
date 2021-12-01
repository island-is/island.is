import { Application, getValueViaPath } from '@island.is/application/core'
import { S3 } from 'aws-sdk'
import AmazonS3URI from 'amazon-s3-uri'
import { FileProvider } from './fileProvider'
import { logger } from '@island.is/logging'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'

export class S3UploadFileProvider implements FileProvider {
  private readonly s3: AWS.S3
  constructor(
    private application: Application,
    private attachmentAnswers: string[],
  ) {
    this.s3 = new S3()
  }

  public async getFiles(): Promise<DocumentInfo[]> {
    const attachments = this.attachmentAnswers
      .map((answerKey) => {
        return getValueViaPath(this.application.answers, answerKey) as Array<{
          key: string
          name: string
        }>
      })
      .flat()
    console.log('attachments', attachments)
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return []
    }
    return await this.toDataProtectionAttachment(attachments)
  }

  private async toDataProtectionAttachment(
    attachments: Array<{
      key: string
      name: string
    }>,
  ): Promise<DocumentInfo[]> {
    return await Promise.all(
      attachments.map(async ({ key, name }) => {
        const url = (this.application.attachments as {
          [key: string]: string
        })[key]

        if (!url) {
          logger.info('Failed to get url from application state')
          return { fileName: name, content: 'no content' }
        }
        const fileContent =
          (await this.getApplicationFilecontentAsBase64(url)) ?? ''

        return { fileName: name, content: fileContent }
      }),
    )
  }

  private async getApplicationFilecontentAsBase64(
    fileName: string,
  ): Promise<string | undefined> {
    const { bucket, key } = AmazonS3URI(fileName)
    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({
          Bucket: uploadBucket,
          Key: key,
        })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64')
    } catch (error) {
      logger.log('error ', error)
      logger.error(error)
      return undefined
    }
  }
}
