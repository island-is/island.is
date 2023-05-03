import { Injectable } from '@nestjs/common'
import {
  DocumentsApi,
  ApiDocumentsDocumentIdGetRequest,
} from '@island.is/clients/consultation-portal'

@Injectable()
export class DocumentService {
  constructor(private documentsApi: DocumentsApi) {}

  async getCaseDocument(documentId: string): Promise<void> {
    const requestParams: ApiDocumentsDocumentIdGetRequest = {
      documentId: documentId,
    }
    const response = await this.documentsApi.apiDocumentsDocumentIdGet(
      requestParams,
    )

    return response
  }
}
