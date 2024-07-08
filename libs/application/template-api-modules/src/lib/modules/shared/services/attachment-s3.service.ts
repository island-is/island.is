import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class AttachmentS3Service {
  private readonly s3: S3Client
  constructor() {
    this.s3 = new S3Client()
  }

  public async getFiles(
    application: Application,
    attachmentAnswerKeys: string[],
  ): Promise<AttachmentData[]> {
    const attachments: AttachmentData[] = []

    for (const key of attachmentAnswerKeys) {
      const answers = getValueViaPath(application.answers, key) as Array<{
        key: string
        name: string
      }>
      if (!answers) continue
      const list = await this.toDocumentDataList(answers, key, application)
      attachments.push(...list)
    }
    return attachments
  }

  private async toDocumentDataList(
    answers: Array<{
      key: string
      name: string
    }>,
    answerKey: string,
    application: Application,
  ): Promise<AttachmentData[]> {
    return await Promise.all(
      answers.map(async ({ key, name }) => {
        const url = (
          application.attachments as {
            [key: string]: string
          }
        )[key]

        if (!url) {
          logger.info('Failed to get url from application state')
          return { key: '', fileContent: '', answerKey, fileName: '' }
        }
        const fileContent =
          (await this.getApplicationFilecontentAsBase64(url)) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }

  private async getApplicationFilecontentAsBase64(
    fileName: string,
  ): Promise<string | undefined> {
    const { bucket, key } = AmazonS3URI(fileName)
    const uploadBucket = bucket
    try {
      const file = await this.s3.send(
        new GetObjectCommand({
          Bucket: uploadBucket,
          Key: key,
        }),
      )
      if (!file.Body) {
        logger.error('Could not find file in S3', { uploadBucket, key })
        return
      }
      const arrayBuffer = await file.Body?.transformToByteArray()
      const fileContent = Buffer.from(arrayBuffer)
      return fileContent?.toString('base64')
    } catch (error) {
      logger.error(error)
      return undefined
    }
  }
}
