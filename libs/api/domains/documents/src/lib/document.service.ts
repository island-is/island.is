import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Document } from './models/document.model'
import {
  CategoryDTO,
  DocumentInfoDTO,
  DocumentDTO,
} from '@island.is/clients/documents'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentClient } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'

@Injectable()
export class DocumentService {
  constructor(
    private documentClient: DocumentClient,
    private documentBuilder: DocumentBuilder,
  ) {}

  async findByDocumentId(
    nationalId: string,
    documentId: string,
  ): Promise<DocumentDetails> {
    try {
      const documentDTO =
        (await this.documentClient.customersDocument({
          kennitala: nationalId,
          messageId: documentId,
          authenticationType: 'HIGH',
        })) || {}

      return DocumentDetails.fromDocumentDTO(documentDTO)
    } catch (exception) {
      logger.error(exception)
      throw new InternalServerErrorException('Error fetching document')
    }
  }

  async listDocuments(nationalId: string): Promise<Document[]> {
    try {
      const body = await this.documentClient.getDocumentList(nationalId)
      const bodyMessages = body?.messages || []

      const aww = [
        {
          id: 'this-is-a-test-id-please-remove',
          subject: 'Niðurstaða álagningar 2021 (eingöngu rafræn skilríki)',
          senderName: 'Ríkisskattstjóri',
          senderKennitala: '5402696029',
          documentDate: '2021-05-28T15:13:08.000Z',
          fileType: 'url',
          url: 'https://thjonustusidur.rsk.is/alagningarsedill',
          opened: false,
          __typename: 'Document',
        },
        ...bodyMessages,
      ]

      return (aww || []).reduce(
        (result: Document[], documentMessage: DocumentInfoDTO) => {
          if (documentMessage)
            result.push(this.documentBuilder.buildDocument(documentMessage))
          return result
        },
        [],
      )
    } catch (exception) {
      logger.error(exception)
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
