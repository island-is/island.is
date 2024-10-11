import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { DocumentInfo } from '@island.is/clients/althingi-ombudsman'
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
    return files.map((file) => {
      const type = this.mapAnswerToType(file.answerKey)
      const fileName = file.fileName
      return {
        subject: fileName,
        content: file.fileContent,
        fileName: fileName,
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
