import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { AttachmentType } from '../../models/attachments'
import { AttachmentS3Service } from '../../../../shared/services'
import { Injectable } from '@nestjs/common'

export interface DocumentBuildInfo {
  key: string
  name: string
  type: AttachmentType
}

export interface AttachmentAnswer {
  name: string
  type: AttachmentType
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
    return files.map((file, index) => {
      const type = this.mapAnswerToType(file.answerKey)
      return {
        subject: `${type} ${index + 1}`,
        content: file.fileContent,
        fileName: file.fileName,
        type: type,
      }
    })
  }

  private mapAnswerToType(answer: string): AttachmentType {
    switch (answer) {
      case 'attachments.documents':
        return AttachmentType.OTHER
      case 'complainedForInformation.powerOfAttorney':
        return AttachmentType.POWEROFATTORNEY
      default:
        throw new Error('Invalid attachment type')
    }
  }
}
