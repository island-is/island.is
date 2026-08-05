import {
  CaseActionEnum,
  GetApplicationAdvertTemplateAdvertTypeEnum,
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
} from './mappers'
import { AddApplicationAttachmentResponse } from '../models/addApplicationAttachment.response'
import { GetApplicationAttachmentInput } from '../models/getApplicationAttachment.input'
import { DeleteApplicationAttachmentInput } from '../models/deleteApplicationAttachment.input'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { GetUserInvolvedPartiesInput } from '../models/getUserInvolvedParties.input'
import {
  CommentActionEnum,
  CommentDirection,
  GetCommentsResponse,
} from '../models/getComments.response'
import { OJOIAApplicationCaseResponse } from '../models/applicationCase.response'
import { GetPdfResponse } from '../models/getPdf.response'
import { OJOIAIdInput } from '../models/id.input'
import { OJOIApplicationAdvertTemplateTypesResponse } from '../models/applicationAdvertTemplateTypes.response'
import { GetInvolvedPartySignaturesInput } from '../models/getInvolvedPartySignatures.input'
import {
  GetInvolvedPartySignature,
  InvolvedPartySignatures,
  SignatureType,
} from '../models/getInvolvedPartySignatures.response'
import { GetAdvertTemplateInput } from '../models/getAdvertTemplate.input'
import { OJOIApplicationAdvertTemplateResponse } from '../models/applicationAdvertTemplate.response'
import { isDefined } from '@island.is/shared/utils'
import { RegulationsService } from '@island.is/clients/regulations'
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import { RegulationViewTypes } from '@island.is/regulations/web'
import { ensureRegName, nameToSlug } from '@island.is/regulations'
import type { Year, ISODate, RegName } from '@island.is/regulations'
import { OJOIAGetRegulationsSearchInput } from '../models/getRegulationsSearch.input'
import { OJOIAGetRegulationFromApiInput } from '../models/getRegulationFromApi.input'
import {
  OJOIARegulationOptionSearchResponse,
  OJOIADraftImpactsResponse,
  OJOIALawChaptersResponse,
  OJOIAMinistriesResponse,
  OJOIACreateDraftResponse,
} from '../models/regulation.response'
import { convertDateToDaysAgo } from './utils'

const LOG_CATEGORY = 'official-journal-of-iceland-application'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
    private readonly regulationsService: RegulationsService,
    private readonly regulationsAdminClientService: RegulationsAdminClientService,
  ) {}

  async getComments(
    input: GetCommentsInput,
    user: User,
  ): Promise<GetCommentsResponse> {
    const incomingComments = await this.ojoiApplicationService.getComments(
      input,
      user,
    )

    const mapped = incomingComments.comments.map((c) => {
      const direction =
        c.action === CaseActionEnum.EXTERNALCOMMENT
          ? CommentDirection.RECEIVED
          : CommentDirection.SENT

      const action =
        c.action === CaseActionEnum.APPLICATIONCOMMENT
          ? CommentActionEnum.APPLICATION
          : CommentActionEnum.EXTERNAL

      return {
        id: c.id,
        age: convertDateToDaysAgo(c.created),
        direction: direction,
        action: action,
        comment: c.comment,
        creator: c.creator.title,
        receiver: c.receiver?.title ?? null,
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
          applicationUserName: input.applicationUserName,
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
        partyName: input.partyName,
      },
      user,
    )
  }

  async getMyUserInfo(user: User) {
    return this.ojoiApplicationService.getMyUserInfo(user)
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
      expectedPublishDate: applicationCase.expectedPublishDate,
    }

    return mapped
  }

  async getPdf(input: OJOIAIdInput, user: User): Promise<GetPdfResponse> {
    try {
      const data = await this.ojoiApplicationService.getPdf(
        {
          id: input.id,
          showDate: input.showDate,
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
    const advertType = mapTemplateTypeEnumToLiteral(
      input.type,
    ) as GetApplicationAdvertTemplateAdvertTypeEnum

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
  ): Promise<GetInvolvedPartySignature> {
    try {
      const data =
        await this.ojoiApplicationService.getSignaturesForInvolvedParty(
          input,
          user,
        )

      const type = data.signature.records.some((record) =>
        isDefined(record.chairman),
      )
        ? SignatureType.Committee
        : SignatureType.Regular

      const records: InvolvedPartySignatures[] = data.signature.records.map(
        (record) => ({
          id: record.id,
          signatureDate: record.signatureDate,
          institution: record.institution,
          additionalSignature: record.additional ?? '',
          members: record.members.map((member) => ({
            name: member.name,
            above: member.textAbove ?? '',
            below: member.textBelow ?? '',
            after: member.textAfter ?? '',
            before: member.textBefore ?? '',
          })),
          chairman: record.chairman
            ? {
                name: record.chairman.name,
                above: record.chairman.textAbove ?? '',
                below: record.chairman.textBelow ?? '',
                after: record.chairman.textAfter ?? '',
                before: record.chairman.textBefore ?? '',
              }
            : undefined,
        }),
      )

      return {
        type: type,
        records: records,
      }
    } catch (error) {
      this.logger.error('Failed to get signatures for involved party', {
        category: LOG_CATEGORY,
        error: error,
      })

      throw error
    }
  }

  // ---- Regulation-related methods ----

  async getRegulationsOptionSearch(
    input: OJOIAGetRegulationsSearchInput,
  ): Promise<OJOIARegulationOptionSearchResponse | null> {
    const results = await this.regulationsService.getRegulationsOptionSearch(
      input.q,
      input.rn,
      input.year as Year | undefined,
      input.yearTo as Year | undefined,
      input.ch,
      input.iA,
      input.iR,
      input.page,
    )

    if (!results) {
      return null
    }

    return { regulations: results }
  }

  async getRegulationOptionList(
    names: string[],
  ): Promise<OJOIARegulationOptionSearchResponse> {
    const regulations = await this.regulationsService.getRegulationOptionList(
      names as RegName[],
    )
    return { regulations: regulations ?? [] }
  }

  async getRegulationFromApi(input: OJOIAGetRegulationFromApiInput) {
    const name = ensureRegName(input.regulation)
    if (!name) {
      return null
    }

    return this.regulationsService.getRegulationOnDate(
      input.date ? RegulationViewTypes.d : RegulationViewTypes.current,
      nameToSlug(name),
      input.date as ISODate | undefined,
    )
  }

  async getRegulationImpactsByName(
    regulation: string,
    user: User,
  ): Promise<OJOIADraftImpactsResponse | null> {
    const name = ensureRegName(regulation)
    if (!name) {
      return null
    }

    const impacts = await this.regulationsAdminClientService.getImpactsByName(
      nameToSlug(name),
      user,
    )

    if (!impacts) {
      return null
    }

    return {
      changes: impacts.filter((i) => i.type === 'amend'),
      cancellations: impacts.filter((i) => i.type === 'repeal'),
    }
  }

  async getLawChapters(): Promise<OJOIALawChaptersResponse | null> {
    const result = await this.regulationsService.getRegulationsLawChapters(
      false,
    )

    if (!result) {
      return null
    }

    return { lawChapters: result }
  }

  async getMinistries(): Promise<OJOIAMinistriesResponse | null> {
    const result = await this.regulationsService.getRegulationsMinistries()

    if (!result) {
      return null
    }

    return { ministries: result }
  }

  async createDraftRegulation(
    type: string,
    user: User,
  ): Promise<OJOIACreateDraftResponse | null> {
    const draft = await this.regulationsAdminClientService.create(user, {
      type: type || 'base',
    })

    if (!draft) {
      this.logger.error('Failed to create regulation draft', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const draftId =
      typeof draft === 'object' && 'id' in draft
        ? (draft as { id: string }).id
        : String(draft)

    return { id: draftId }
  }

  async getDraftRegulation(draftId: string, user: User) {
    try {
      return await this.regulationsAdminClientService.getDraftRegulation(
        draftId,
        user,
      )
    } catch (error) {
      this.logger.error('Failed to get regulation draft', {
        category: LOG_CATEGORY,
        draftId,
        error,
      })
      return null
    }
  }

  async updateDraftRegulation(
    draftId: string,
    body: {
      title?: string
      text?: string
      appendixes?: Array<{ title: string; text: string }>
      draftingNotes?: string
      idealPublishDate?: string
      effectiveDate?: string
      ministry?: string
      signatureDate?: string
      signatureText?: string
      lawChapters?: string[]
      fastTrack?: boolean
      type?: string
      signedDocumentUrl?: string
    },
    user: User,
  ) {
    try {
      await this.regulationsAdminClientService.updateById(
        draftId,
        {
          draftingStatus: 'draft',
          title: body.title ?? '',
          text: body.text ?? '',
          draftingNotes: body.draftingNotes ?? '',
          appendixes: body.appendixes,
          idealPublishDate: body.idealPublishDate,
          effectiveDate: body.effectiveDate,
          ministry: body.ministry,
          signatureDate: body.signatureDate,
          signatureText: body.signatureText,
          lawChapters: body.lawChapters,
          fastTrack: body.fastTrack,
          type: body.type,
          signedDocumentUrl: body.signedDocumentUrl,
        },
        user,
      )
      return true
    } catch (error) {
      this.logger.error('Failed to update regulation draft', {
        category: LOG_CATEGORY,
        draftId,
        error,
      })
      return false
    }
  }

  async createDraftImpact(
    input: {
      draftId: string
      type: 'amend' | 'repeal'
      regulation: string
      date: string
      title?: string
      text?: string
      appendixes?: Array<{ title: string; text: string }>
      comments?: string
      diff?: string
    },
    user: User,
  ): Promise<OJOIACreateDraftResponse | null> {
    try {
      if (input.type === 'amend') {
        const result =
          await this.regulationsAdminClientService.createDraftRegulationChange(
            {
              changingId: input.draftId,
              regulation: input.regulation,
              date: input.date,
              title: input.title ?? '',
              text: input.text ?? '',
              appendixes: input.appendixes,
              comments: input.comments,
              diff: input.diff,
            },
            user,
          )
        const id =
          result && typeof result === 'object' && 'id' in result
            ? (result as { id: string }).id
            : undefined
        return id ? { id } : null
      } else {
        const result =
          await this.regulationsAdminClientService.createDraftRegulationCancel(
            {
              changingId: input.draftId,
              regulation: input.regulation,
              date: input.date,
            },
            user,
          )
        const id =
          result && typeof result === 'object' && 'id' in result
            ? (result as { id: string }).id
            : undefined
        return id ? { id } : null
      }
    } catch (error) {
      this.logger.error('Failed to create draft impact', {
        category: LOG_CATEGORY,
        draftId: input.draftId,
        type: input.type,
        error,
      })
      return null
    }
  }

  async updateDraftImpact(
    input: {
      impactId: string
      type: 'amend' | 'repeal'
      date?: string
      title?: string
      text?: string
      appendixes?: Array<{ title: string; text: string }>
      comments?: string
      diff?: string
    },
    user: User,
  ): Promise<boolean> {
    try {
      if (input.type === 'amend') {
        await this.regulationsAdminClientService.updateDraftRegulationChange(
          {
            date: input.date,
            title: input.title,
            text: input.text,
            appendixes: input.appendixes,
            comments: input.comments,
            diff: input.diff,
          },
          input.impactId,
          user,
        )
      } else {
        await this.regulationsAdminClientService.updateDraftRegulationCancel(
          {
            id: input.impactId,
            date: input.date,
          },
          user,
        )
      }
      return true
    } catch (error) {
      this.logger.error('Failed to update draft impact', {
        category: LOG_CATEGORY,
        impactId: input.impactId,
        type: input.type,
        error,
      })
      return false
    }
  }

  async deleteDraftImpact(
    impactId: string,
    type: 'amend' | 'repeal',
    user: User,
  ): Promise<boolean> {
    try {
      if (type === 'amend') {
        await this.regulationsAdminClientService.deleteDraftRegulationChange(
          impactId,
          user,
        )
      } else {
        await this.regulationsAdminClientService.deleteDraftRegulationCancel(
          { id: impactId },
          user,
        )
      }
      return true
    } catch (error) {
      this.logger.error('Failed to delete draft impact', {
        category: LOG_CATEGORY,
        impactId,
        type,
        error,
      })
      return false
    }
  }
}
