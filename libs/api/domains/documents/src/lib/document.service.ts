import { Injectable, NotFoundException } from '@nestjs/common'
import { Document } from './models/document.model'
import { CategoryDTO, DocumentInfoDTO, DocumentDTO } from './client/models'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentClient } from './client/documentClient'

@Injectable()
export class DocumentService {
  constructor(private documentClient: DocumentClient) {}

  async findByDocumentId(
    nationalId: string,
    documentId: string,
  ): Promise<DocumentDetails> {
    try {
      const rawDocumentDTO = await this.documentClient.customersDocument({
        kennitala: nationalId,
        messageId: documentId,
        authenticationType: 'LOW',
      })

      const documentDTO: DocumentDTO = {
        ...rawDocumentDTO,
        fileType: rawDocumentDTO.fileType || '',
        content: rawDocumentDTO.content || '',
        htmlContent: rawDocumentDTO.htmlContent || '',
        url: rawDocumentDTO.url || '',
      }

      return DocumentDetails.fromDocumentDTO(documentDTO)
    } catch (exception) {
      logger.error(exception)
      throw new NotFoundException('Error fetching document')
    }
  }

  async listDocuments(nationalId: string): Promise<Document[]> {
    try {
      const body = await this.documentClient.getDocumentList(nationalId)

      return (body?.messages || []).reduce(function (
        result: Document[],
        documentMessage: DocumentInfoDTO,
      ) {
        if (documentMessage)
          result.push(Document.fromDocumentInfo(documentMessage))
        return result
      },
      [])
    } catch (exception) {
      logger.error(JSON.stringify(exception))
      return []
    }
  }

  async getCategories(nationalId: string): Promise<DocumentCategory[]> {
    try {
      const body = await this.documentClient.customersCategories(nationalId)
      return (body?.categories || []).reduce(function (
        result: DocumentCategory[],
        category: CategoryDTO,
      ) {
        if (category) result.push(DocumentCategory.fromCategoryDTO(category))
        return result
      },
      [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }
}
