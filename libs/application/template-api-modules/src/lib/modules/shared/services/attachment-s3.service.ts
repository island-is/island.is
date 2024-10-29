import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { S3Service } from '@island.is/nest/aws'
import { ApplicationService } from '@island.is/application/api/core'
import { sharedModuleConfig } from '../shared.config'
import { ConfigType } from '@nestjs/config'
import { uuid } from 'uuidv4'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class AttachmentS3Service {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly applicationService: ApplicationService,
  ) {}

  public async getFiles(
    application: ApplicationWithAttachments,
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
    application: ApplicationWithAttachments,
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
          (await this.s3Service.getFileContent(url, 'base64')) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }

  async addAttachment(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    return this.saveAttachmentToApplication(
      application,
      fileName,
      buffer,
      uploadParameters,
    )
  }

  async saveAttachmentToApplication(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    const uploadBucket = this.config.templateApi.attachmentBucket
    if (!uploadBucket) throw new Error('No attachment bucket configured')

    const fileId = uuid()
    const attachmentKey = `${fileId}-${fileName}`
    const s3key = `${application.id}/${attachmentKey}`
    const url = await this.s3Service.uploadFile(
      buffer,
      { bucket: uploadBucket, key: s3key },
      uploadParameters,
    )

    await this.applicationService.update(application.id, {
      attachments: {
        ...application.attachments || {},
        [attachmentKey]: url,
      },
    })

    return attachmentKey
  }

  async getAttachmentUrl(
    application: ApplicationWithAttachments,
    attachmentKey: string,
    expiration: number,
  ): Promise<string> {
    if (expiration <= 0) {
      throw new Error('Expiration must be positive')
    }
    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      throw new Error('Attachment not found')
    }

    return this.s3Service.getPresignedUrl(fileName, expiration)
  }
}
