import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import path from 'path'
import { ApplicationAttachmentService } from './applicationAttachment.service'
import {
  CitizenshipAttachment,
  CitizenshipAttachmentGatherRequest,
} from '../types/attachments'
import { createHash } from 'crypto'

@Injectable()
export class CitizenshipAttachmentProvider {
  constructor(private attachmentService: ApplicationAttachmentService) {}

  public async getFiles(
    gatherRequest: CitizenshipAttachmentGatherRequest[],
    application: Application,
  ): Promise<CitizenshipAttachment[]> {
    const answerKeys = gatherRequest.map((x) => x.answerKey)
    const files = await this.attachmentService.getFiles(application, answerKeys)

    return files.map((file) => {
      const request = this.getGatherRequestByAnswerKey(
        file.answerKey,
        gatherRequest,
      )
      return {
        content: file.fileContent,
        hash: this.hashFile(file.fileContent),
        name: this.formatFilename(
          file.key,
          file.fileName,
          request.filenamePrefix,
        ),
      }
    })
  }

  private getGatherRequestByAnswerKey(
    answerKey: string,
    gatherRequest: CitizenshipAttachmentGatherRequest[],
  ): CitizenshipAttachmentGatherRequest {
    const type = gatherRequest.find((x) => x.answerKey === answerKey)
    if (!type) {
      throw new Error(`No attachment type found for answer key ${answerKey}`)
    }
    return type
  }

  private formatFilename(key: string, name: string, prefix: string): string {
    const [guid = ''] = key.split('_')

    const fileEnding = path.extname(name)

    return `${guid}_${prefix}${fileEnding}`
  }

  private hashFile(fileContent: string): string {
    const hash = createHash('sha256')
    hash.update(fileContent)
    return hash.digest('hex')
  }
}
