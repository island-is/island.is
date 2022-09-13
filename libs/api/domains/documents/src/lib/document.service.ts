import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Document, DocumentListResponse } from './models/document.model'
import {
  CategoryDTO,
  DocumentInfoDTO,
  SenderDTO,
  TypeDTO,
} from '@island.is/clients/documents'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentClient } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'
import { GetDocumentListInput } from './dto/getDocumentListInput'
import { DocumentType } from './models/documentType.model'
import { DocumentSender } from './models/documentSender.model'

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

      return (body?.messages || []).reduce(
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
  async listDocumentsV2(
    nationalId: string,
    input: GetDocumentListInput,
  ): Promise<DocumentListResponse> {
    try {
      const body = await this.documentClient.getDocumentList(nationalId, input)
      return {
        data: (body?.messages || []).reduce(
          (result: Document[], documentMessage: DocumentInfoDTO) => {
            if (documentMessage)
              result.push(this.documentBuilder.buildDocument(documentMessage))
            return result
          },
          [],
        ),
        totalCount: body?.totalCount,
      }
    } catch (exception) {
      logger.error(exception)
      return { data: [], totalCount: 0 }
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

  async getTypes(nationalId: string): Promise<DocumentType[]> {
    try {
      const body = await this.documentClient.customersTypes(nationalId)
      return (body?.types || []).reduce(function (
        result: DocumentType[],
        type: TypeDTO,
      ) {
        if (type) result.push(DocumentType.fromTypeDTO(type))
        return result
      },
      [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }

  async getSenders(nationalId: string): Promise<DocumentSender[]> {
    try {
      const body = await this.documentClient.customersSenders(nationalId)
      return (body?.senders || []).reduce(function (
        result: DocumentSender[],
        sender: SenderDTO,
      ) {
        if (sender) result.push(DocumentSender.fromSenderDTO(sender))
        return result
      },
      [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }
}
