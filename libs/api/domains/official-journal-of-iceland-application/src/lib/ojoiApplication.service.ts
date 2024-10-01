import { OfficialJournalOfIcelandApplicationClientService } from '@island.is/clients/official-journal-of-iceland/application'
import { Inject, Injectable } from '@nestjs/common'
import { PostCommentInput } from '../models/postComment.input'
import { PostApplicationInput } from '../models/postApplication.input'
import { GetCommentsInput } from '../models/getComments.input'
import { GetPresignedUrlInput } from '../models/getPresignedUrl.input'
import { GetPresignedUrlResponse } from '../models/getPresignedUrl.response'
import { AddApplicationAttachmentInput } from '../models/addApplicationAttachment.input'
import {
  mapAttachmentType,
  mapGetAttachmentType,
  mapPresignedUrlType,
} from './mappers'
import { AddApplicationAttachmentResponse } from '../models/addApplicationAttachment.response'
import { GetApplicationAttachmentInput } from '../models/getApplicationAttachment.input'
import { DeleteApplicationAttachmentInput } from '../models/deleteApplicationAttachment.input'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { GetUserInvolvedPartiesInput } from '../models/getUserInvolvedParties.input'

const LOG_CATEGORY = 'official-journal-of-iceland-application'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
  ) {}

  async getComments(input: GetCommentsInput, user: User) {
    return this.ojoiApplicationService.getComments(input, user)
  }

  async postComment(input: PostCommentInput, user: User) {
    const success = this.ojoiApplicationService.postComment(
      {
        id: input.id,
        postApplicationComment: {
          comment: input.comment,
        },
      },
      user,
    )

    return {
      success,
    }
  }

  async getPdfUrl(id: string, user: User) {
    return this.ojoiApplicationService.getPdfUrl(
      {
        id,
      },
      user,
    )
  }

  async postApplication(
    input: PostApplicationInput,
    user: User,
  ): Promise<boolean> {
    return this.ojoiApplicationService.postApplication(input, user)
  }

  async getPrice(id: string, user: User) {
    return this.ojoiApplicationService.getPrice(
      {
        id,
      },
      user,
    )
  }

  async getPresignedUrl(
    input: GetPresignedUrlInput,
    user: User,
  ): Promise<GetPresignedUrlResponse> {
    const attachmentType = mapPresignedUrlType(input.attachmentType)

    return this.ojoiApplicationService.getPresignedUrl(
      {
        id: input.applicationId,
        type: attachmentType,
        getPresignedUrlBody: {
          fileName: input.fileName,
          fileType: input.fileType,
        },
      },
      user,
    )
  }

  async addApplicationAttachment(
    input: AddApplicationAttachmentInput,
    user: User,
  ): Promise<AddApplicationAttachmentResponse> {
    try {
      const attachmentType = mapAttachmentType(input.attachmentType)

      this.ojoiApplicationService.addApplicationAttachment(
        {
          id: input.applicationId,
          type: attachmentType,
          postApplicationAttachmentBody: {
            fileName: input.fileName,
            originalFileName: input.originalFileName,
            fileFormat: input.fileFormat,
            fileExtension: input.fileExtension,
            fileLocation: input.fileLocation,
            fileSize: input.fileSize,
          },
        },
        user,
      )

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error('Failed to add application attachment', {
        category: LOG_CATEGORY,
        applicationId: input.applicationId,
        error: error,
      })
      return {
        success: false,
      }
    }
  }

  async getApplicationAttachments(
    input: GetApplicationAttachmentInput,
    user: User,
  ) {
    return this.ojoiApplicationService.getApplicationAttachments(
      {
        id: input.applicationId,
        type: mapGetAttachmentType(input.attachmentType),
      },
      user,
    )
  }

  async deleteApplicationAttachment(
    input: DeleteApplicationAttachmentInput,
    user: User,
  ) {
    try {
      await this.ojoiApplicationService.deleteApplicationAttachment(
        {
          id: input.applicationId,
          key: input.key,
        },
        user,
      )

      return { success: true }
    } catch (error) {
      this.logger.error('Failed to delete application attachment', {
        category: LOG_CATEGORY,
        applicationId: input.applicationId,
        error: error,
      })
      return { success: false }
    }
  }

  async getUserInvolvedParties(input: GetUserInvolvedPartiesInput, user: User) {
    return this.ojoiApplicationService.getUserInvolvedParties(
      {
        id: input.applicationId,
      },
      user,
    )
  }
}
