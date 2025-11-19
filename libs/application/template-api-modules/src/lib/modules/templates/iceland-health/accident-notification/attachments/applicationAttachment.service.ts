import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'

import { logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { Injectable } from '@nestjs/common'

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
        application,
      )
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
          (await this.s3Service.getFileContent(url, 'base64')) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }
}
