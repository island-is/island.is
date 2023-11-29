import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'

import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { S3Service } from './s3.service'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class ApplicationAttachmentService {
  constructor(private readonly s3Service: S3Service) {}

  public async getFiles(
    application: Application,
    attachmentAnswerKeys: string[],
  ): Promise<AttachmentData[]> {
    const attachments: AttachmentData[] = []
    for (let i = 0; i < attachmentAnswerKeys.length; i++) {
      const answers = getValueViaPath(
        application.answers,
        attachmentAnswerKeys[i],
      ) as Array<{
        key: string
        name: string
      }>
      if (!answers) continue

      const list = await this.toDocumentDataList(
        answers,
        attachmentAnswerKeys[i],
      )
      attachments.push(...list)
    }
    return attachments
  }

  public async toDocumentDataList(
    answers: Array<{
      key: string
      name: string
    }>,
    answerKey: string,
  ): Promise<AttachmentData[]> {
    return await Promise.all(
      answers.map(async ({ key, name }) => {
        const fileName = key

        if (!fileName) {
          logger.info('Failed to get url from application state')
          return { key: '', fileContent: '', answerKey, fileName: '' }
        } else {
          logger.info('did not fail to get url from application state')
        }
        const fileContent =
          (await this.s3Service.getFilecontentAsBase64(fileName)) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }
}
