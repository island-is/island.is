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
import { PaperMailBody } from './models/paperMail.model'
import { PostRequestPaperInput } from './dto/postRequestPaperInput'
import { PostMailActionInput } from './dto/postMailActionInput'
import { ActionMailBody } from './models/actionMail.model'
import { PostBulkMailActionInput } from './dto/postBulkMailActionInput'

const LOG_CATEGORY = 'documents-api'
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
    const healthId = '3' // The
    let newInput: GetDocumentListInput = input
    try {
      if (
        (input.categoryId === '' ||
          input.categoryId?.indexOf(healthId) !== -1) &&
        input.isLegalGuardian
      ) {
        const allCategories = await this.getCategories(nationalId)
        if (allCategories.find((x) => x.id === healthId)) {
          newInput = {
            ...input,
            categoryId: allCategories
              .filter((item) => item.id !== healthId)
              .map((item) => item.id)
              .toString(),
          }
        }
      }

      const body = await this.documentClient.getDocumentList(
        nationalId,
        newInput,
      )

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

  async getPaperMailInfo(nationalId: string): Promise<PaperMailBody> {
    try {
      const res = await this.documentClient.requestPaperMail(nationalId)
      return {
        nationalId: res?.kennitala,
        wantsPaper: res?.wantsPaper,
      }
    } catch (exception) {
      logger.error(exception)
      return {
        nationalId,
        wantsPaper: undefined,
      }
    }
  }

  async postPaperMailInfo(
    nationalId: string,
    body: PostRequestPaperInput,
  ): Promise<PaperMailBody> {
    try {
      const postBody = {
        kennitala: nationalId,
        wantsPaper: body.wantsPaper,
      }
      const res = await this.documentClient.postPaperMail(postBody)
      return {
        nationalId: res?.kennitala,
        wantsPaper: res?.wantsPaper,
      }
    } catch (exception) {
      logger.error('Post paper mail failed', {
        category: LOG_CATEGORY,
        error: exception,
      })
      return {
        nationalId,
        wantsPaper: undefined,
      }
    }
  }

  async postMailAction(body: PostMailActionInput): Promise<ActionMailBody> {
    try {
      const { action, ...postBody } = body
      await this.documentClient.postMailAction(postBody, action)
      return {
        success: true,
        messageId: body.messageId,
        action: body.action,
      }
    } catch (e) {
      logger.error('Post mail action failed', {
        category: LOG_CATEGORY,
        error: e,
      })
      return {
        success: false,
        messageId: body.messageId,
        action: body.action,
      }
    }
  }

  async bulkMailAction(body: PostBulkMailActionInput): Promise<ActionMailBody> {
    const messageIds = body.messageIds ?? []
    const stringIds = messageIds.toString()
    try {
      await this.documentClient.bulkMailAction(
        {
          ids: messageIds,
          action: body.action,
          status: body.status,
        },
        body.nationalId,
      )
      return {
        success: true,
        messageId: stringIds,
      }
    } catch (e) {
      logger.error('Post batch action failed', {
        category: LOG_CATEGORY,
        ...e,
      })
      return {
        success: false,
        messageId: stringIds,
      }
    }
  }
}
