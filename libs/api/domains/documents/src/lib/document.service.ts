import { Injectable } from '@nestjs/common'
import { Document } from './models/document.model'
import { CustomersApi } from '../../gen/fetch/'
import { ListDocumentsInput } from './dto/listDocumentsInput'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'

@Injectable()
export class DocumentService {

  constructor(private customersApi: CustomersApi) {
    logger.debug('Document Service init')
  }

  async findByDocumentId(natReg: string, documentId: string): Promise<DocumentDetails> {
    try {
      const documentDTO = await this.customersApi.customersDocument({
        kennitala: natReg,
        messageId: documentId,
        authenticationType: 'LOW'
      })

      return DocumentDetails.fromDocumentDTO(documentDTO)
    } catch (exception) {
      throw exception
    }
  }

  async listDocuments(input: ListDocumentsInput): Promise<Document[]> {
    try {
      const body = await this.customersApi.customersListDocuments({
        kennitala: input.natReg,
        dateFrom: input.dateFrom,
        dateTo: input.dateTo,
        categoryId: input.category
      })
      return body.messages.reduce(function (result, message) {
        if (message) result.push(Document.fromDocumentInfo(message))
        return result
      }, [])

    } catch (exception) {
      return []
    }
  }

  async getCategories(natReg: string) {
    try {
      const body = await this.customersApi.customersCategories({ kennitala: natReg })
      body.categories
    } catch (exception) {
      return []
    }
  }
}


