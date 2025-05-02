import {
  CustomersListDocumentsOrderEnum,
  CustomersListDocumentsSortByEnum,
  CustomersWantsPaperMailRequest,
} from '../../gen/fetch'
import { Injectable, Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { ListDocumentsInputDto } from './dto/listDocuments.input'
import { ListDocumentsDto } from './dto/documentList.dto'
import { isDefined } from '@island.is/shared/utils'
import { mapToDocumentInfoDto } from './dto/documentInfo.dto'
import { MailAction } from './dto/mailAction.dto'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DocumentListApi } from './documentsClientV2.provider'

@Injectable()
export class DocumentsListClientV2Service {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private api: DocumentListApi,
  ) {}

  async getDocumentList(
    input: ListDocumentsInputDto,
  ): Promise<ListDocumentsDto | null> {
    /**
     *
     * @param input List input object. Example: { dateFrom: undefined, nationalId: '123' }
     * @returns List object sanitized of unnecessary values. Example: { nationalId: '123' }
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizeObject = function <T extends { [key: string]: any }>(
      obj: T,
    ): T {
      const sanitizedObj = {} as T
      for (const key in obj) {
        if (obj[key] || key === 'opened') {
          sanitizedObj[key] = obj[key]
        }
      }
      return sanitizedObj
    }

    // If hiddenCats is not empty and categories are empty, the API will return no documents
    if (input.hiddenCategoryIds !== '' && input.categoryId === '') {
      return {
        totalCount: 0,
        unreadCount: 0,
        documents: [],
      }
    }

    const inputObject = sanitizeObject({
      ...input,
      kennitala: input.nationalId,
      page: input.page ?? 1,
      senderKennitala:
        input.senderNationalId && input.senderNationalId.length > 0
          ? input.senderNationalId.join()
          : undefined,
      order: input.order
        ? CustomersListDocumentsOrderEnum[input.order]
        : undefined,
      sortBy: input.sortBy
        ? CustomersListDocumentsSortByEnum[input.sortBy]
        : undefined,
    })

    const documents = await this.api.customersListDocuments(inputObject)

    if (!documents.totalCount) {
      return null
    }

    return {
      totalCount: documents.totalCount,
      unreadCount: documents.unreadCount,
      documents:
        documents.messages
          ?.map((m) => mapToDocumentInfoDto(m))
          .filter(isDefined) ?? [],
    }
  }

  async getPageNumber(
    nationalId: string,
    documentId: string,
    pageSize: number,
  ): Promise<number | null> {
    const res = await this.api.customersGetDocumentPage({
      kennitala: nationalId,
      messageId: documentId,
      pageSize,
    })

    return res.messagePage ?? null
  }
  getCustomersCategories(nationalId: string) {
    return this.api.customersCategories({ kennitala: nationalId })
  }
  getCustomersTypes(nationalId: string) {
    return this.api.customersMessageTypes({ kennitala: nationalId })
  }
  getCustomersSenders(nationalId: string) {
    return this.api.customersSenders({ kennitala: nationalId })
  }
  requestPaperMail(input: CustomersWantsPaperMailRequest) {
    return this.api.customersWantsPaperMail(input)
  }
  updatePaperMailPreference(nationalId: string, wantsPaper: boolean) {
    return this.api.customersUpdatePaperMailPreference({
      kennitala: nationalId,
      paperMail: {
        kennitala: nationalId,
        wantsPaper: wantsPaper,
      },
    })
  }
  async markAllMailAsRead(nationalId: string) {
    await this.api.customersReadAllDocuments({
      kennitala: nationalId,
    })
    return {
      success: true,
    }
  }
  async archiveMail(nationalId: string, documentId: string) {
    await this.api.customersArchive({
      kennitala: nationalId,
      messageId: documentId,
    })
    return {
      success: true,
      ids: [documentId],
    }
  }
  async unarchiveMail(nationalId: string, documentId: string) {
    await this.api.customersUnarchive({
      kennitala: nationalId,
      messageId: documentId,
    })
    return {
      success: true,
      ids: [documentId],
    }
  }
  async bookmarkMail(nationalId: string, documentId: string) {
    await this.api.customersBookmark({
      kennitala: nationalId,
      messageId: documentId,
    })
    return {
      success: true,
      ids: [documentId],
    }
  }
  async unbookmarkMail(nationalId: string, documentId: string) {
    await this.api.customersUnbookmark({
      kennitala: nationalId,
      messageId: documentId,
    })
    return {
      success: true,
      ids: [documentId],
    }
  }

  async batchArchiveMail(
    nationalId: string,
    documentIds: Array<string>,
    status: boolean,
  ): Promise<MailAction | null> {
    await this.api.customersBatchArchive({
      kennitala: nationalId,
      batchRequest: { ids: documentIds, status },
    })

    return {
      success: true,
      ids: documentIds,
    }
  }

  async batchBookmarkMail(
    nationalId: string,
    documentIds: Array<string>,
    status: boolean,
  ) {
    await this.api.customersBatchBookmark({
      kennitala: nationalId,
      batchRequest: { ids: documentIds, status },
    })

    return {
      success: true,
      ids: documentIds,
    }
  }

  async batchReadMail(nationalId: string, documentIds: Array<string>) {
    await this.api.customersBatchReadDocuments({
      kennitala: nationalId,
      request: { ids: documentIds },
    })
    return {
      success: true,
      ids: documentIds,
    }
  }
}
