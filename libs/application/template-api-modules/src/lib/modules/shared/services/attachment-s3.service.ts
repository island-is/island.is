import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { S3Service } from './s3.service'
import { ConfigService } from '@nestjs/config'
import {
  BaseTemplateApiApplicationService,
  BaseTemplateAPIModuleConfig,
} from '../../../types'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class AttachmentS3Service {
  constructor(
    @Inject(S3Service) private s3Service: S3Service,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    @Inject(BaseTemplateApiApplicationService)
    private readonly applicationService: BaseTemplateApiApplicationService,
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
          (await this.s3Service.getFileContentAsBase64(url)) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }

  public async getAttachmentContentAsBase64(
    application: ApplicationWithAttachments,
    attachmentKey: string,
  ): Promise<string> {
    const fileContent =
      await this.s3Service.getFileFromApplicationWithAttachments(
        application,
        attachmentKey,
      )
    return fileContent?.Body?.transformToString('base64') || ''
  }

  public async getAttachmentContentAsBlob(
    application: ApplicationWithAttachments,
    attachmentKey: string,
  ): Promise<Blob> {
    const file = await this.s3Service.getFileFromApplicationWithAttachments(
      application,
      attachmentKey,
    )
    const fileArrayBuffer = await file?.Body?.transformToByteArray()
    return new Blob([fileArrayBuffer as ArrayBuffer], {
      type: file?.ContentType,
    })
  }

  public async getAttachmentUrl(
    key: string,
    expiration: number,
  ): Promise<string> {
    if (expiration <= 0) {
      return Promise.reject('expiration must be positive')
    }

    const bucket = this.configService.get('attachmentBucket') as
      | string
      | undefined

    if (bucket == undefined) {
      return Promise.reject('could not find s3 bucket')
    }

    return this.s3Service.getSignedUrlPromise(bucket, key, expiration)
  }

  public async addAttachment(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    return this.applicationService.saveAttachmentToApplicaton(
      application,
      fileName,
      buffer,
      uploadParameters,
    )
  }
}
