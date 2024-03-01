import {
  CustomersApi,
  CustomersArchiveRequest,
  CustomersBatchArchiveRequest,
  CustomersBatchBookmarkRequest,
  CustomersBatchReadDocumentsRequest,
  CustomersBookmarkRequest,
  CustomersCategoriesRequest,
  CustomersListDocumentsOrderEnum,
  CustomersListDocumentsSortByEnum,
  CustomersMessageTypesRequest,
  CustomersSendersRequest,
  CustomersUnarchiveRequest,
  CustomersUnbookmarkRequest,
  CustomersUpdatePaperMailPreferenceRequest,
  CustomersWantsPaperMailRequest,
} from '../../gen/fetch'
import { Injectable } from '@nestjs/common'
import { DocumentDto, mapToDocument } from './dto/document.dto'
import { ListDocumentsInputDto } from './dto/listDocuments.input.dto'
import { ListDocumentsDto } from './dto/documentList.dto'
import { isDefined } from '@island.is/shared/utils'
import { mapToDocumentInfoDto } from './dto/documentInfo.dto'

@Injectable()
export class DocumentsClientV2Service {
  constructor(private api: CustomersApi) {}

  async getDocumentList(
    input: ListDocumentsInputDto,
  ): Promise<ListDocumentsDto | null> {
    const documents = await this.api.customersListDocuments({
      ...input,
      kennitala: input.nationalId,
      senderKennitala: input.senderNationalId,
      order: input.order
        ? CustomersListDocumentsOrderEnum[input.order]
        : undefined,
      sortBy: input.sortBy
        ? CustomersListDocumentsSortByEnum[input.sortBy]
        : undefined,
    })

    if (!documents.totalCount) {
      //throw maybe?
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

  async getCustomersDocument(
    customerId: string,
    documentId: string,
  ): Promise<DocumentDto | null> {
    const document = await this.api.customersDocument({
      kennitala: customerId,
      messageId: documentId,
      authenticationType: 'HIGH',
    })

    return mapToDocument(document)
  }
  getCustomersCategories(nationalId: string) {
    return this.api.customersCategories({ kennitala: nationalId })
  }
  getCustomersTypes(input: CustomersMessageTypesRequest) {
    return this.api.customersMessageTypes(input)
  }
  getCustomersSenders(input: CustomersSendersRequest) {
    return this.api.customersSenders(input)
  }
  requestPaperMail(input: CustomersWantsPaperMailRequest) {
    return this.api.customersWantsPaperMail(input)
  }
  updatePaperMailPreferance(body: CustomersUpdatePaperMailPreferenceRequest) {
    return this.api.customersUpdatePaperMailPreference(body)
  }
  archiveMail(body: CustomersArchiveRequest) {
    return this.api.customersArchive(body)
  }
  unArchiveMail(body: CustomersUnarchiveRequest) {
    return this.api.customersUnarchive(body)
  }
  bookmarkMail(body: CustomersBookmarkRequest) {
    return this.api.customersBookmark(body)
  }
  unbookmarkMail(body: CustomersUnbookmarkRequest) {
    return this.api.customersUnbookmark(body)
  }
  batchArchiveMail(body: CustomersBatchArchiveRequest) {
    return this.api.customersBatchArchive(body)
  }
  batchBookmarkMail(body: CustomersBatchBookmarkRequest) {
    return this.api.customersBatchBookmark(body)
  }
  batchReadMail(body: CustomersBatchReadDocumentsRequest) {
    return this.api.customersBatchReadDocuments(body)
  }
}
