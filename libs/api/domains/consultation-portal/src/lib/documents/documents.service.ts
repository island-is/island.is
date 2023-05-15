import { Inject, Injectable } from '@nestjs/common'
import {
  DocumentsApi,
  ApiDocumentsDocumentIdGetRequest,
} from '@island.is/clients/consultation-portal'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class DocumentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private documentsApi: DocumentsApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'documents_service',
    }
    this.logger.error(errorDetail || 'Documents Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  async getCaseDocument(documentId: string): Promise<void> {
    const requestParams: ApiDocumentsDocumentIdGetRequest = {
      documentId: documentId,
    }

    const response = await this.documentsApi
      .apiDocumentsDocumentIdGet(requestParams)
      .catch((e) => this.handle4xx(e, 'failed to get document'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }
}
