import { Injectable, NotFoundException } from '@nestjs/common'
import { Document } from './models/document.model'
import { CustomersApi, CategoryDTO, DocumentInfoDTO } from '../../gen/fetch/'
import { ListDocumentsInput } from './dto/listDocumentsInput'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'

@Injectable()
export class DocumentService {

  constructor(private customersApi: CustomersApi) {
    logger.debug('Document Service init')
  }

  async findByDocumentId(natReg: string, documentId: string): Promise<DocumentDetails> {
    try {
      console.log('gettin')
      const documentDTO = await this.customersApi.customersDocument({
        kennitala: natReg,
        messageId: documentId,
        authenticationType: 'LOW'
      })
      console.log(documentDTO)
      return DocumentDetails.fromDocumentDTO(documentDTO)
    } catch (exception) {
      throw new NotFoundException('Error fetching document')
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
      return body.messages.reduce(function (result: Document[], message: DocumentInfoDTO) {
        if (message) result.push(Document.fromDocumentInfo(message))
        return result
      }, [])

    } catch (exception) {
      return []
    }
  }

  async getCategories(natReg: string): Promise<DocumentCategory[]> {
    try {
      const body = await this.customersApi.customersCategories({ kennitala: natReg })
      return body.categories.reduce(function (result: DocumentCategory[], category: CategoryDTO) {
        if (category) result.push(DocumentCategory.fromDocumentDTO(category))
        return result
      }, [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }
}


