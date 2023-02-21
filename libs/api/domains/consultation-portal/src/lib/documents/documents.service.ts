import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import {
  DocumentsApi,
  ApiDocumentsDocumentIdGetRequest,
} from '@island.is/clients/consultation-portal'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class DocumentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private documentsApi: DocumentsApi,
  ) {}
  handleError(error: FetchError | ApolloError): void {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

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
