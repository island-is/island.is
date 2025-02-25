import { Inject, Injectable } from '@nestjs/common'
import {
  DocumentsClientV2Service,
  MessageAction,
} from '@island.is/clients/documents-v2'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Category } from './models/v2/category.model'
import { MailAction } from './models/v2/bulkMailAction.input'
import {
  PaginatedDocuments,
  Document,
  DocumentPageNumber,
  Action,
} from './models/v2/document.model'
import type { ConfigType } from '@island.is/nest/config'
import { DocumentsInput } from './models/v2/documents.input'
import { PaperMailPreferences } from './models/v2/paperMailPreferences.model'
import { Sender } from './models/v2/sender.model'
import { FileType } from './models/v2/documentContent.model'
import { HEALTH_CATEGORY_ID, LAW_AND_ORDER_CATEGORY_ID } from './document.types'
import { Type } from './models/v2/type.model'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { DocumentV2MarkAllMailAsRead } from './models/v2/markAllMailAsRead.model'
import type { User } from '@island.is/auth-nest-tools'
import { AuthDelegationType } from '@island.is/shared/types'
import { getBirthday } from './helpers/getBirthday'
import differceInYears from 'date-fns/differenceInYears'
import type { Locale } from '@island.is/shared/types'

const LOG_CATEGORY = 'documents-api-v2'
@Injectable()
export class DocumentServiceV2 {
  constructor(
    private documentService: DocumentsClientV2Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  async findDocumentById(
    nationalId: string,
    documentId: string,
  ): Promise<Document | null> {
    const document = await this.documentService.getCustomersDocument(
      nationalId,
      documentId,
    )

    if (!document) {
      return null // Null document logged in clients-documents-v2
    }

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
      content: {
        type,
        value: document.content,
      },
    }
  }

  async findDocumentByIdV3(
    nationalId: string,
    documentId: string,
    locale?: Locale,
    includeDocument?: boolean,
  ): Promise<Document | null> {
    const document = await this.documentService.getCustomersDocument(
      nationalId,
      documentId,
      locale,
      includeDocument,
    )

    if (!document) {
      return null // Null document logged in clients-documents-v2
    }

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
    if (document.urgent)
      this.logger.info('Urgent document fetched', {
        documentId: documentId,
        includeDocument,
      })

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
    }
  }

  async listDocuments(
    user: User,
    input: DocumentsInput,
  ): Promise<PaginatedDocuments> {
    //If a delegated user is viewing the mailbox, do not return any health related data
    //Category is now "1,2,3,...,n"
    const { categoryIds, ...restOfInput } = input
    let mutableCategoryIds = categoryIds ?? []
    if (!mutableCategoryIds.length) {
      const filteredCategories = await this.getCategories(user)
      if (isDefined(filteredCategories)) {
        mutableCategoryIds = filteredCategories.map((c) => c.id)
      }
    }
    // If categoryIds are provided, filter out correct data
    else {
      const hiddenCategoryIds = this.getHiddenCategoriesIDs(user)
      mutableCategoryIds.filter((c) => !hiddenCategoryIds.includes(c))
    }

    const documents = await this.documentService.getDocumentList({
      ...restOfInput,
      categoryId: mutableCategoryIds.join(),
      nationalId: user.nationalId,
    })

    if (typeof documents?.totalCount !== 'number') {
      this.logger.warn('Document total count unavailable', {
        category: LOG_CATEGORY,
        totalCount: documents?.totalCount,
      })
    }

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
          }
        })
        .filter(isDefined) ?? []

    return {
      data: documentData,
      totalCount: documents?.totalCount ?? 0,
      unreadCount: documents?.unreadCount,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async listDocumentsV3(
    user: User,
    input: DocumentsInput,
  ): Promise<PaginatedDocuments> {
    //If a delegated user is viewing the mailbox, do not return any health related data
    //Category is now "1,2,3,...,n"
    const { categoryIds, ...restOfInput } = input
    // If no categoryIds are provided, get all categories
    let mutableCategoryIds = categoryIds ?? []

    if (!mutableCategoryIds.length) {
      const filteredCategories = await this.getCategories(user)
      if (isDefined(filteredCategories)) {
        mutableCategoryIds = filteredCategories.map((c) => c.id)
      }
    }
    // If categoryIds are provided, filter out correct data
    else {
      const hiddenCategoryIds = this.getHiddenCategoriesIDs(user)
      mutableCategoryIds.filter((c) => !hiddenCategoryIds.includes(c))
    }

    const documents = await this.documentService.getDocumentList({
      ...restOfInput,
      categoryId: mutableCategoryIds.join(),
      hiddenCategoryIds: this.getHiddenCategoriesIDs(user).join(),
      nationalId: user.nationalId,
    })

    if (typeof documents?.totalCount !== 'number') {
      this.logger.warn('Document total count unavailable', {
        category: LOG_CATEGORY,
        totalCount: documents?.totalCount,
      })
    }
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

  async getCategories(user: User): Promise<Array<Category> | null> {
    const categories = await this.documentService.getCustomersCategories(
      user.nationalId,
    )

    const filterOutIds = this.getHiddenCategoriesIDs(user) ?? []

    const filteredCategories =
      categories.categories
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
    const isDelegated = isDefined(user.delegationType)
    if (!isDelegated) return []

    const isLegalGuardian = user.delegationType?.includes(
      AuthDelegationType.LegalGuardian,
    )
    const birthdate = getBirthday(user.nationalId)
    const childAgeIs16OrOlder = birthdate
      ? differceInYears(new Date(), birthdate) > 15
      : false

    // Hide health data if user is a legal guardian and child is 16 or older
    const hideHealthData = isLegalGuardian && childAgeIs16OrOlder
    // Hide law and order data if user is delegated
    // commented out until we have correct category for law and order files
    const hideLawAndOrderData = isDelegated

    return [
      ...(hideHealthData ? [HEALTH_CATEGORY_ID] : []),
      ...(hideLawAndOrderData ? [LAW_AND_ORDER_CATEGORY_ID] : []),
    ]
  }
}
