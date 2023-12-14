import { Inject, Injectable } from '@nestjs/common'
import { Document, DocumentListResponse } from './models/document.model'
import {
  CategoryDTO,
  DocumentInfoDTO,
  SenderDTO,
  TypeDTO,
} from '@island.is/clients/documents'
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
import {
  CustomersListDocumentsSortByEnum,
  DocumentsV2ClientService,
} from '@island.is/clients/documents-v2'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'

const LOG_CATEGORY = 'documents-api'
@Injectable()
export class DocumentService {
  constructor(
    private documentClient: DocumentsV2ClientService,
    private documentBuilder: DocumentBuilder,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByDocumentId(
    nationalId: string,
    documentId: string,
  ): Promise<DocumentDetails> {
    const documentDTO =
      (await this.documentClient.getCustomersDocument({
        kennitala: nationalId,
        messageId: documentId,
        authenticationType: 'HIGH',
      })) || {}

    return DocumentDetails.fromDocumentDTO(documentDTO)
  }

  async listDocuments(nationalId: string): Promise<Document[]> {
    const body = await this.documentClient.getDocumentList({
      kennitala: nationalId,
    })

    return (
      body.messages
        ?.map((m) => this.documentBuilder.buildDocument(m))
        .filter(isDefined) ?? []
    )
  }
  async listDocumentsV2(
    nationalId: string,
    input: GetDocumentListInput,
  ): Promise<DocumentListResponse> {
    const healthId = '3' // The
    let newInput: GetDocumentListInput = input
    if (
      (input.categoryId === '' || input.categoryId?.indexOf(healthId) !== -1) &&
      input.isLegalGuardian
    ) {
      const allCategories =
        (await this.getCategories({ kennitala: nationalId })) ?? []
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

    const { dateFrom, dateTo, ...requestInput } = newInput

    const body = await this.documentClient.getDocumentList({
      kennitala: nationalId,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      ...requestInput,
    })

    return {
      data:
        body?.messages
          ?.map((m) => this.documentBuilder.buildDocument(m))
          .filter(isDefined) ?? [],

      totalCount: body?.totalCount,
    }
  }

  async getCategories(nationalId: string): Promise<DocumentCategory[] | null> {
    const body = await this.documentClient.getCustomersCategories({
      kennitala: nationalId,
    })
    return (
      body?.categories
        ?.map((c) => DocumentCategory.fromCategoryDTO(c))
        .filter(isDefined) ?? []
    )
  }

  async getTypes(nationalId: string): Promise<DocumentType[] | null> {
    const body = await this.documentClient.getCustomersTypes({
      kennitala: nationalId,
    })
    return (
      body?.types?.map((t) => DocumentType.fromTypeDTO(t)).filter(isDefined) ??
      []
    )
  }

  async getSenders(nationalId: string): Promise<DocumentSender[]> {
    const body = await this.documentClient.getCustomersSenders({
      kennitala: nationalId,
    })
    return (
      body?.senders
        ?.map((sender) => DocumentSender.fromSenderDTO(sender))
        .filter(isDefined) ?? []
    )
  }

  async getPaperMailInfo(nationalId: string): Promise<PaperMailBody> {
    try {
      const res = await this.documentClient.requestPaperMail({
        kennitala: nationalId,
      })
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
    version: 'v1' | 'v2' = 'v1',
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

  async postMailAction(
    body: PostMailActionInput,
    version: 'v1' | 'v2' = 'v1',
  ): Promise<ActionMailBody> {
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

  async bulkMailAction(
    body: PostBulkMailActionInput,
    version: 'v1' | 'v2' = 'v1',
  ): Promise<ActionMailBody> {
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
