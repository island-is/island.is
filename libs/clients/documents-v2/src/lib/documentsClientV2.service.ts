import {
  CustomersApi,
  CustomersListDocumentsOrderEnum,
  CustomersListDocumentsSortByEnum,
  CustomersWantsPaperMailRequest,
} from '../../gen/fetch'
import { Injectable } from '@nestjs/common'
import { DocumentDto, mapToDocument } from './dto/document.dto'
import { ListDocumentsInputDto } from './dto/listDocuments.input'
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
  archiveMail(nationalId: string, documentId: string) {
    return this.api.customersArchive({
      kennitala: nationalId,
      messageId: documentId,
    })
  }
  unarchiveMail(nationalId: string, documentId: string) {
    return this.api.customersUnarchive({
      kennitala: nationalId,
      messageId: documentId,
    })
  }
  bookmarkMail(nationalId: string, documentId: string) {
    return this.api.customersBookmark({
      kennitala: nationalId,
      messageId: documentId,
    })
  }
  unbookmarkMail(nationalId: string, documentId: string) {
    return this.api.customersUnbookmark({
      kennitala: nationalId,
      messageId: documentId,
    })
  }

  batchArchiveMail(
    nationalId: string,
    documentIds: Array<string>,
    status: boolean,
  ) {
    return this.api.customersBatchArchive({
      kennitala: nationalId,
      batchRequest: { ids: documentIds, status },
    })
  }

  batchBookmarkMail(
    nationalId: string,
    documentIds: Array<string>,
    status: boolean,
  ) {
    return this.api.customersBatchBookmark({
      kennitala: nationalId,
      batchRequest: { ids: documentIds, status },
    })
  }

  batchReadMail(nationalId: string, documentIds: Array<string>) {
    return this.api.customersBatchReadDocuments({
      kennitala: nationalId,
      request: { ids: documentIds },
    })
  }
}
