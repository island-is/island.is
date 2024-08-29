import { OfficialJournalOfIcelandApplicationClientService } from '@island.is/clients/official-journal-of-iceland/application'
import { Injectable } from '@nestjs/common'
import { PostCommentInput } from '../models/postComment.input'
import { PostApplicationInput } from '../models/postApplication.input'
import { GetCommentsInput } from '../models/getComments.input'
import { UploadAttachmentsInput } from '../models/uploadAttachments.input'
import { UploadAttachmentsResponse } from '../models/uploadAttachments.response'
import { GetPresignedUrlInput } from '../models/getPresignedUrl.input'
import { GetPresignedUrlResponse } from '../models/getPresignedUrl.response'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
  ) {}

  async getComments(input: GetCommentsInput) {
    return this.ojoiApplicationService.getComments(input)
  }

  // async postComment(input: PostCommentInput) {
  //   return this.ojoiApplicationService.postComment({
  //     id: input.id,
  //     // comment: input.comment,
  //   })
  // }

  async getPdfUrl(id: string) {
    return this.ojoiApplicationService.getPdfUrl({
      id,
    })
  }

  async getPdf(id: string) {
    return this.ojoiApplicationService.getPdf({
      id,
    })
  }

  async postApplication(input: PostApplicationInput): Promise<boolean> {
    return this.ojoiApplicationService.postApplication(input)
  }

  async getPrice(id: string) {
    return this.ojoiApplicationService.getPrice({
      id,
    })
  }

  async uploadAttachments(
    input: UploadAttachmentsInput,
  ): Promise<UploadAttachmentsResponse> {
    const buffer = Buffer.from(input.base64, 'base64')

    return this.ojoiApplicationService.uploadAttachments(
      input.applicationId,
      buffer,
    )
  }

  async getPresignedUrl(
    input: GetPresignedUrlInput,
  ): Promise<GetPresignedUrlResponse> {
    return this.ojoiApplicationService.getPresignedUrl({
      id: input.applicationId,
      getPresignedUrlBody: {
        fileName: input.fileName,
        fileType: input.fileType,
        isOriginal: input.isOriginal,
      },
    })
  }
}
