import {
  CaseActionEnum,
  OfficialJournalOfIcelandApplicationClientService,
} from '@island.is/clients/official-journal-of-iceland/application'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
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
  mapTemplateTypeEnumToLiteral,
  mapTemplateTypeLiteralToEnum,
  safeEnumMapper,
} from './mappers'
import { AddApplicationAttachmentResponse } from '../models/addApplicationAttachment.response'
import { GetApplicationAttachmentInput } from '../models/getApplicationAttachment.input'
import { DeleteApplicationAttachmentInput } from '../models/deleteApplicationAttachment.input'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { GetUserInvolvedPartiesInput } from '../models/getUserInvolvedParties.input'
import {
  CaseComment,
  CaseCommentTypeEnum,
  GetCommentsResponse,
} from '../models/getComments.response'
import { OJOIAApplicationCaseResponse } from '../models/applicationCase.response'
import { GetPdfResponse } from '../models/getPdf.response'
import { OJOIAIdInput } from '../models/id.input'
import { OJOIApplicationAdvertTemplateTypesResponse } from '../models/applicationAdvertTemplateTypes.response'
import { GetInvolvedPartySignaturesInput } from '../models/getInvolvedPartySignatures.input'
import { InvolvedPartySignatures } from '../models/getInvolvedPartySignatures.response'
import { GetAdvertTemplateInput } from '../models/getAdvertTemplate.input'
import { OJOIApplicationAdvertTemplateResponse } from '../models/applicationAdvertTemplate.response'

const LOG_CATEGORY = 'official-journal-of-iceland-application'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
  ) {}

  async getComments(
    input: GetCommentsInput,
    user: User,
  ): Promise<GetCommentsResponse> {
    const incomingComments = await this.ojoiApplicationService.getComments(
      input,
      user,
    )

    const getDative = (days: number) => {
      if (days % 10 === 1 && days % 100 !== 11) {
        return 'degi'
      }
      return 'dögum'
    }

    const now = new Date()
    const mapped: CaseComment[] = incomingComments.comments.map((c) => {
      const commentDate = new Date(c.created)

      const diff = now.getTime() - commentDate.getTime()
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
      const dative = getDative(diffDays)

      const action =
        c.action === CaseActionEnum.APPLICATIONCOMMENT
          ? CaseCommentTypeEnum.APPLICATION_COMMENT
          : CaseCommentTypeEnum.EXTERNAL_COMMENT

      const age =
        diffDays === 0
          ? 'Í dag'
          : diffDays === 1
          ? 'Í gær'
          : `f. ${diffDays} ${dative})}`

      return {
        id: c.id,
        age: age,
        creator: c.creator.title,
        comment: c.comment,
        action: action,
      }
    })

    return {
      comments: mapped,
    }
  }

  async postComment(input: PostCommentInput, user: User) {
    const success = await this.ojoiApplicationService.postComment(
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

  async getApplicationCase(
    id: string,
    user: User,
  ): Promise<OJOIAApplicationCaseResponse> {
    const { applicationCase } =
      await this.ojoiApplicationService.getApplicationCase(
        {
          id,
        },
        user,
      )

    let title = 'Óþekkt'

    if ('title' in applicationCase.status) {
      title = applicationCase.status.title as string
    }

    const mapped: OJOIAApplicationCaseResponse = {
      department: applicationCase.department.title,
      type: applicationCase.type.title,
      categories: applicationCase.categories.map((c) => c.title),
      html: applicationCase.html,
      status: title,
      communicationStatus: applicationCase.communicationStatus.title,
    }

    return mapped
  }

  async getPdf(input: OJOIAIdInput, user: User): Promise<GetPdfResponse> {
    try {
      const data = await this.ojoiApplicationService.getPdf(
        {
          id: input.id,
        },
        user,
      )

      return {
        pdf: data.content,
      }
    } catch (error) {
      this.logger.error('Failed to get pdf', {
        category: LOG_CATEGORY,
        applicationId: input.id,
        error: error,
      })

      throw error
    }
  }

  async getAdvertTemplate(
    input: GetAdvertTemplateInput,
    user: User,
  ): Promise<OJOIApplicationAdvertTemplateResponse> {
    const advertType = mapTemplateTypeEnumToLiteral(input.type)

    if (!advertType) {
      //Shouldn't happen
      this.logger.error('Invalid advert type supplied', {
        category: LOG_CATEGORY,
        applicationId: input.type,
      })
      throw new BadRequestException('Invalid advert type')
    }

    const data = await this.ojoiApplicationService.getApplicationAdvertTemplate(
      { advertType },
      user,
    )
    return {
      html: data.html,
      type: mapTemplateTypeLiteralToEnum(data.type),
    }
  }

  async getAdvertTemplateTypes(
    user: User,
  ): Promise<OJOIApplicationAdvertTemplateTypesResponse> {
    const templateTypes =
      await this.ojoiApplicationService.getApplicationAdvertTemplateTypes(user)

    return {
      types: templateTypes.map(({ title, type }) => ({
        title,
        type: mapTemplateTypeLiteralToEnum(type),
      })),
    }
  }

  async getInvolvedPartySignatures(
    input: GetInvolvedPartySignaturesInput,
    user: User,
  ): Promise<InvolvedPartySignatures> {
    try {
      const data =
        await this.ojoiApplicationService.getSignaturesForInvolvedParty(
          input,
          user,
        )

      return {
        ...data,
        members: data.members.map((member) => ({
          name: member.text ?? undefined,
          above: member.textAbove ?? undefined,
          before: member.textBefore ?? undefined,
          below: member.textBelow ?? undefined,
          after: member.textAfter ?? undefined,
        })),
        ...(data?.chairman && {
          chairman: {
            name: data.chairman.text ?? undefined,
            above: data.chairman.textAbove ?? undefined,
            before: data.chairman.textBefore ?? undefined,
            below: data.chairman.textBelow ?? undefined,
            after: data.chairman.textAfter ?? undefined,
          },
        }),
      }
    } catch (error) {
      this.logger.error('Failed to get signatures for involved party', {
        category: LOG_CATEGORY,
        error: error,
      })

      throw error
    }
  }
}
