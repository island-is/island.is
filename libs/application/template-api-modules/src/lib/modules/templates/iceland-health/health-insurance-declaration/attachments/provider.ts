import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { AttachmentS3Service } from '../../../../shared/services'
import { Injectable } from '@nestjs/common'

export interface DocumentBuildInfo {
  key: string
  name: string
  type: string
}

export interface AttachmentAnswer {
  name: string
  type: string
}

export interface DocumentInfo {
  fileName: string
  contentType: string
  data: string
}

@Injectable()
export class ApplicationAttachmentProvider {
  constructor(private attachmentService: AttachmentS3Service) {}

  public async getFiles(
    attachmentAnswers: string[],
    application: Application,
  ): Promise<DocumentInfo[]> {
    const files = await this.attachmentService.getFiles(
      application,
      attachmentAnswers,
    )
    return files.map((file) => {
      const fileName = file.fileName
      return {
        fileName: fileName,
        contentType: 'application/pdf',
        data: file.fileContent,
      }
    })
  }
}
