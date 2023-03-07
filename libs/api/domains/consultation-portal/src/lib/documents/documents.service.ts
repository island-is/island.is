import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import {
  DocumentsApi,
  ApiDocumentsDocumentIdGetRequest,
} from '@island.is/clients/consultation-portal'

@Injectable()
export class DocumentService {
  constructor(private documentsApi: DocumentsApi) {}

  async getDocument(documentId: string): Promise<void> {
    const requestParams: ApiDocumentsDocumentIdGetRequest = {
      documentId: documentId,
    }
    const response = await this.documentsApi.apiDocumentsDocumentIdGet(
      requestParams,
    )

    return response
  }
}
