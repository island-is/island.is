import { Application, getValueViaPath } from '@island.is/application/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'

@Injectable()
export class AttachmentProvider {
  private readonly s3: AWS.S3
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    this.s3 = new S3()
  }

  async gatherAllAttachments(
    application: Application,
  ): Promise<{ name: string; content: string }[]> {
    try {
      const injuryCertificateFile = await this.prepareApplicationAttachments(
        application,
        'attachments.injuryCertificateFile',
      )
      const deathCertificateFile = await this.prepareApplicationAttachments(
        application,
        'attachments.deathCertificateFile',
      )
      const powerOfAttorneyFile = await this.prepareApplicationAttachments(
        application,
        'attachments.powerOfAttorneyFile',
      )

      return [
        ...injuryCertificateFile,
        ...deathCertificateFile,
        ...powerOfAttorneyFile,
      ]
    } catch (error) {
      this.logger.error('Failed to gather attachments for application', {
        error,
      })
      throw new Error('Failed to gather attachments for application')
    }
  }

  private async prepareApplicationAttachments(
    application: Application,
    answerKey: string,
  ): Promise<{ name: string; content: string }[]> {
    const attachments = getValueViaPath(
      application.answers,
      answerKey,
    ) as Array<{ key: string; name: string }>
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return []
    }

    return await Promise.all(
      attachments.map(async ({ key, name }) => {
        console.log('mapping key ', key)
        console.log(application.attachments)
        const url = (application.attachments as {
          [key: string]: string
        })[key]

        if (!url) {
          this.logger.info('Failed to get url from application state')
          return { name, content: 'no content' }
        }
        const fileContent =
          (await this.getApplicationFilecontentAsBase64(url)) ?? ''

        return { name, content: fileContent }
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
      console.log('error ', error)
      console.error(error)
      return undefined
    }
  }
}
