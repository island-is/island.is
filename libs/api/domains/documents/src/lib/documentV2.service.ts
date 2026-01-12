import type { User } from '@island.is/auth-nest-tools'
import {
  DocumentsClientV2Service,
  MessageAction,
} from '@island.is/clients/documents-v2'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { AuthDelegationType } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { HEALTH_CATEGORY_ID, LAW_AND_ORDER_CATEGORY_ID } from './document.types'
import { Action } from './models/v2/actions.model'
import { MailAction } from './models/v2/bulkMailAction.input'
import { Category } from './models/v2/category.model'
import {
  Document,
  DocumentPageNumber,
  PaginatedDocuments,
} from './models/v2/document.model'
import { FileType } from './models/v2/documentContent.model'
import { DocumentsInput } from './models/v2/documents.input'
import { DocumentV2MarkAllMailAsRead } from './models/v2/markAllMailAsRead.model'
import { PaperMailPreferences } from './models/v2/paperMailPreferences.model'
import { ReplyInput } from './models/v2/reply.input'
import { Reply } from './models/v2/reply.model'
import { Sender } from './models/v2/sender.model'
import { Type } from './models/v2/type.model'

const LOG_CATEGORY = 'documents-api-v2'

@Injectable()
export class DocumentServiceV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly featureService: FeatureFlagService,
    private documentService: DocumentsClientV2Service,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  async findDocumentById(
    user: User,
    documentId: string,
    locale?: Locale,
    includeDocument?: boolean,
  ): Promise<Document | null> {
    const document = await this.documentService.getCustomersDocument(
      user.nationalId,
      documentId,
      locale,
      includeDocument,
    )

    if (!document) {
      return null // Null document logged in clients-documents-v2
    }

    const use2Way = await this.featureService.getValue(
      Features.isServicePortal2WayMailboxEnabled,
      false,
      user,
    )

    let type: FileType
    switch (document.fileType) {
      case 'html':
        type = FileType.HTML
        break
      case 'pdf':
        type = FileType.PDF
        break
      case 'url':
        type = FileType.URL
        break
      default:
        type = FileType.UNKNOWN
    }
    // Data for the confirmation modal
    let confirmation = document.actions?.find(
      (action) => action.type === 'confirmation',
    )

    if (
      !isDefined(confirmation?.title) ||
      confirmation?.title === '' ||
      confirmation?.data === '' ||
      !isDefined(confirmation?.data)
    ) {
      confirmation = undefined
    }

    // Data for the alert box
    const alert = document.actions?.find((action) => action.type === 'alert')
    const actions = document.actions?.filter(
      (action) => action.type !== 'alert' && action.type !== 'confirmation',
    )

    const ticket = use2Way
      ? {
          id: document.ticket?.id?.toString(),
          authorId: document.ticket?.authorId?.toString(),
          createdDate: document.ticket?.createdAt,
          updatedDate: document.ticket?.updatedAt,
          status: document.ticket?.status,
          subject: document.ticket?.subject,
          comments: document.ticket?.comments?.map((c) => ({
            id: c.id?.toString(),
            body: c.body,
            createdDate: c.createdAt,
            authorId: c.authorId?.toString(),
            author: c.author,
            isZendeskAgent: c.isAgent,
          })),
        }
      : null

    return {
      ...document,
      publicationDate: document.date,
      id: documentId,
      name: document.fileName,
      downloadUrl: `${this.downloadServiceConfig.baseUrl}/download/v1/electronic-documents/${documentId}`,
      sender: {
        id: document.senderNationalId,
        name: document.senderName,
      },
      content: document.content
        ? {
            type,
            value: document.content,
          }
        : undefined,
      isUrgent: document.urgent,
      actions: this.actionMapper(documentId, actions),
      confirmation: confirmation,
      alert: alert,
      replyable: use2Way ? document.replyable : false,
      closedForMoreReplies: use2Way
        ? ticket?.status?.toLowerCase() === 'closed'
        : null,
      ticket: ticket,
    }
  }

  async listDocuments(
    user: User,
    input: DocumentsInput,
  ): Promise<PaginatedDocuments> {
    //If a delegated user is viewing the mailbox, do not return any health or law and order related data
    //Category is now "1,2,3,...,n"
    const { categoryIds, ...restOfInput } = input
    let mutableCategoryIds = categoryIds ?? []

    const hiddenCategoryIds = this.getHiddenCategoriesIDs(user)
    const displayAllCategories =
      !mutableCategoryIds.length && !hiddenCategoryIds.length
    // if categories input ids is empty and hidden cat ids is empty we dont need to filter categories
    if (!displayAllCategories) {
      const filteredCategories = await this.getCategories(
        user,
        hiddenCategoryIds,
      )

      if (!mutableCategoryIds.length) {
        if (isDefined(filteredCategories)) {
          mutableCategoryIds = filteredCategories.map((c) => c.id)
        }
      }
      // If categoryIds are provided, filter out correct data
      else {
        mutableCategoryIds = mutableCategoryIds.filter(
          (c) => !hiddenCategoryIds.includes(c),
        )
      }
    }

    const documents = await this.documentService.getDocumentList({
      ...restOfInput,
      categoryId: displayAllCategories ? undefined : mutableCategoryIds.join(),
      hiddenCategoryIds: hiddenCategoryIds.join(),
      nationalId: user.nationalId,
    })

    if (typeof documents?.totalCount !== 'number') {
      this.logger.warn('Document total count unavailable', {
        category: LOG_CATEGORY,
        totalCount: documents?.totalCount,
      })
    }
    const use2Way = await this.featureService.getValue(
      Features.isServicePortal2WayMailboxEnabled,
      false,
      user,
    )
    const documentData: Array<Document> =
      documents?.documents
        .map((d) => {
          if (!d) {
            return null
          }

          return {
            ...d,
            id: d.id,
            downloadUrl: `${this.downloadServiceConfig.baseUrl}/download/v1/electronic-documents/${d.id}`,
            sender: {
              name: d.senderName,
              id: d.senderNationalId,
            },
            isUrgent: d.urgent,
            replyable: use2Way ? d.replyable : false,
            ticket: undefined,
          }
        })
        .filter(isDefined) ?? []

    return {
      data: documentData, // if empty after category filter then return null
      totalCount: documents?.totalCount ?? 0,
      unreadCount: documents?.unreadCount,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getCategories(
    user: User,
    hiddenCategoryIds?: string[],
  ): Promise<Array<Category> | null> {
    let categories

    try {
      categories = await this.documentService.getCustomersCategories(
        user.nationalId,
      )
    } catch (error) {
      this.logger.warn('Error fetching document categories', {
        category: LOG_CATEGORY,
        error: error,
      })
    }

    const filterOutIds =
      hiddenCategoryIds ?? this.getHiddenCategoriesIDs(user) ?? []
    const filteredCategories =
      categories?.categories
        ?.map((c) => {
          if (
            !c.id ||
            (filterOutIds.length > 0 && filterOutIds.includes(c.id))
          ) {
            return null
          } else {
            return {
              id: c.id,
              name: c.name,
            }
          }
        })
        .filter(isDefined) ?? []
    if (filteredCategories.length === 0) return null

    return filteredCategories
  }

  async getTypes(nationalId: string): Promise<Array<Type>> {
    const res = await this.documentService.getCustomersTypes(nationalId)

    return (
      res.types
        ?.map((t) => {
          if (!t.id) {
            return null
          }
          return {
            id: t.id,
            name: t.name,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getSenders(nationalId: string): Promise<Array<Sender>> {
    const res = await this.documentService.getCustomersSenders(nationalId)

    return (
      res.senders
        ?.map((s) => {
          if (!s.kennitala) {
            return null
          }
          return {
            id: s.kennitala,
            name: s.name,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getPageNumber(
    nationalId: string,
    documentId: string,
    pageSize: number,
  ): Promise<DocumentPageNumber> {
    const defaultRes = 1
    try {
      const res = await this.documentService.getPageNumber(
        nationalId,
        documentId,
        pageSize,
      )

      return {
        pageNumber: res ?? defaultRes,
      }
    } catch (exception) {
      this.logger.warn('Document page number error', {
        category: LOG_CATEGORY,
        documentId,
        error: exception,
      })
      return {
        pageNumber: defaultRes,
      }
    }
  }

  async getPaperMailInfo(
    nationalId: string,
  ): Promise<PaperMailPreferences | null> {
    const res = await this.documentService.requestPaperMail({
      kennitala: nationalId,
    })

    if (!res.kennitala || !res.wantsPaper) {
      return null
    }

    return {
      wantsPaper: res.wantsPaper,
      nationalId: res.kennitala,
    }
  }

  async postPaperMailInfo(
    nationalId: string,
    wantsPaper: boolean,
  ): Promise<PaperMailPreferences | null> {
    const res = await this.documentService.updatePaperMailPreference(
      nationalId,
      wantsPaper,
    )

    if (!res.kennitala || !res.wantsPaper) {
      return null
    }

    return {
      wantsPaper: res.wantsPaper,
      nationalId: res.kennitala,
    }
  }

  async markAllMailAsRead(
    nationalId: string,
  ): Promise<DocumentV2MarkAllMailAsRead> {
    this.logger.debug('Marking all mail as read', {
      category: LOG_CATEGORY,
    })
    const res = await this.documentService.markAllMailAsRead(nationalId)

    return {
      success: res.success,
    }
  }

  async postMailAction(
    nationalId: string,
    documentId: string | Array<string>,
    action: MailAction,
  ) {
    if (Array.isArray(documentId)) {
      switch (action) {
        case MailAction.ARCHIVE:
          return this.documentService.batchArchiveMail(
            nationalId,
            documentId,
            true,
          )
        case MailAction.UNARCHIVE:
          return this.documentService.batchArchiveMail(
            nationalId,
            documentId,
            false,
          )
        case MailAction.BOOKMARK:
          return this.documentService.batchBookmarkMail(
            nationalId,
            documentId,
            true,
          )
        case MailAction.UNBOOKMARK:
          return this.documentService.batchBookmarkMail(
            nationalId,
            documentId,
            false,
          )
        case MailAction.READ:
          return this.documentService.batchReadMail(nationalId, documentId)
        default:
          this.logger.error('Invalid bulk document action', {
            action,
            category: LOG_CATEGORY,
          })
          throw new Error('Invalid bulk document action')
      }
    }
    switch (action) {
      case MailAction.ARCHIVE:
        return this.documentService.archiveMail(nationalId, documentId)
      case MailAction.UNARCHIVE:
        return this.documentService.unarchiveMail(nationalId, documentId)
      case MailAction.BOOKMARK:
        return this.documentService.bookmarkMail(nationalId, documentId)
      case MailAction.UNBOOKMARK:
        return this.documentService.unbookmarkMail(nationalId, documentId)
      case MailAction.READ:
        return this.documentService.batchReadMail(nationalId, [documentId])
      default:
        this.logger.error('Invalid single document action', {
          action,
          category: LOG_CATEGORY,
        })
        throw new Error('Invalid single document action')
    }
  }

  async postReply(user: User, input: ReplyInput): Promise<Reply | null> {
    try {
      const res = await this.documentService.postTicket(
        user.nationalId,
        input.documentId,
        {
          body: input.body,
          subject: input.subject,
          requesterEmail: input.requesterEmail,
          requesterName: input.requesterName,
        },
      )
      // if no ticket id is returned we handle error client side
      if (!res.ticketId) {
        return null
      }
      return { id: res.ticketId?.toString(), email: res.reqeusterEmail }
    } catch (error) {
      this.logger.error('Failed to post reply', {
        category: LOG_CATEGORY,
        error: error,
        documentId: input.documentId,
      })
      return null
    }
  }

  private actionMapper = (id: string, actions?: Array<MessageAction>) => {
    if (actions === undefined || actions.length === 0) return undefined
    const hasEmpty = actions.every(
      (x) =>
        x?.data === undefined ||
        x.title === undefined ||
        x.title === '' ||
        x.data === '',
    )

    // we return the document even if the actions are faulty, logged for tracability
    if (hasEmpty) {
      this.logger.debug('No title or data in actions array, return undefined', {
        category: LOG_CATEGORY,
        id,
      })
      return undefined
    }

    const mapped: Array<Action> = actions?.map((x) => {
      if (x.type === 'file') {
        return {
          ...x,
          icon: 'download',
          data: `${this.downloadServiceConfig.baseUrl}/download/v1/electronic-documents/${id}`,
        }
      }
      if (x.type === 'url') {
        return {
          ...x,
          icon: 'open',
        }
      }
      return {
        ...x,
        icon: 'receipt',
      }
    })

    // Log the actions to ensure that they are mapped correctly
    this.logger.debug('Actions mapped successfully', { actions: mapped })
    return mapped
  }

  private getHiddenCategoriesIDs = (user: User) => {
    // Test users
    // Parent 121286-1499 (legal guardian)
    // Teen 271009-1430 (16-17)
    // Child  010714-1410 (under 16)
    try {
      const isDelegated = isDefined(user.delegationType)
      if (!isDelegated) return []

      const isCompany = user.delegationType?.includes(
        AuthDelegationType.ProcurationHolder,
      )
      const isMinor = user.delegationType?.includes(
        AuthDelegationType.LegalGuardianMinor, // Delegation is a child under 16
      )
      const isLegalGuardian = user.delegationType?.includes(
        AuthDelegationType.LegalGuardian,
      )

      // Hide health data if user is a legal guardian and child is 16 or older
      const hideHealthData = isLegalGuardian && !isMinor

      // Hide law and order data if user is delegated
      const hideLawAndOrderData = isDelegated
      this.logger.debug('Should hide document categories', {
        hideHealthData,
        hideLawAndOrderData,
        isLegalGuardian,
        isMinor,
        isCompany,
      })
      return [
        ...(hideHealthData ? [HEALTH_CATEGORY_ID] : []),
        ...(hideLawAndOrderData ? [LAW_AND_ORDER_CATEGORY_ID] : []),
      ]
    } catch (error) {
      this.logger.warn('Error fetching hidden categories', {
        category: LOG_CATEGORY,
        error: error,
      })
      return []
    }
  }
}
