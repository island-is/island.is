import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { logger } from '@island.is/logging'
import { AwsService } from '@island.is/nest/aws'
import { Injectable } from '@nestjs/common'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class AttachmentS3Service {
  constructor(private readonly aws: AwsService) {}

  /**
   * This function retrieves files from an application based on provided attachment keys.
   * It iterates over the attachment keys, retrieves the corresponding answers from the application,
   * and converts them into a list of document data. The resulting list of document data is then returned.
   *
   * @param {Application} application - The application from which to retrieve files.
   * @param {string[]} attachmentAnswerKeys - The keys of the attachments to retrieve.
   * @returns {Promise<AttachmentData[]>} - A promise that resolves to an array of attachment data.
   */
  public async getFiles(
    application: Application,
    attachmentAnswerKeys: string | string[],
  ): Promise<AttachmentData[]> {
    if (!Array.isArray(attachmentAnswerKeys)) {
      attachmentAnswerKeys = [attachmentAnswerKeys]
    }
    const attachments: AttachmentData[] = []

    for (const key of attachmentAnswerKeys) {
      const answers = getValueViaPath<
        Array<{
          key: string
          name: string
        }>
      >(application.answers, key)
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
    try {
      const file = await this.aws.getFile(fileName)
      const fileContent = file.Body
      return fileContent?.transformToString('base64')
    } catch (error) {
      logger.error(error)
      return undefined
    }
  }
}
