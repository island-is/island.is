import { CustomersApi } from '../../gen/fetch'
import { Injectable, Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { DocumentDto, mapToDocument } from './dto/document.dto'
import { LOGGER_PROVIDER } from '@island.is/logging'

const LOG_CATEGORY = 'clients-documents-v2'

@Injectable()
export class DocumentsClientV2Service {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private api: CustomersApi,
  ) {}

  async getCustomersDocument(
    customerId: string,
    documentId: string,
    locale?: string,
    includeDocument?: boolean,
  ): Promise<DocumentDto | null> {
    const document = await this.api.customersDocument({
      kennitala: customerId,
      messageId: documentId,
      authenticationType: 'HIGH',
      locale: locale,
      includeDocument: includeDocument,
    })

    const mappedDocument = mapToDocument(document, includeDocument)

    if (!mappedDocument) {
      this.logger.warn('No document content available for findDocumentById', {
        category: LOG_CATEGORY,
        documentId,
        documentProvider: document?.senderName ?? 'No provider available',
      })
      return null
    }

    if (!mappedDocument?.senderNationalId || !mappedDocument?.date) {
      this.logger.warn('Document display data missing', {
        category: LOG_CATEGORY,
        documentId,
        documentProvider: document?.senderName ?? 'No provider available',
      })
    }

    return mappedDocument
  }
}
