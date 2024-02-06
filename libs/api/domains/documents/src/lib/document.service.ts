import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Document, DocumentListResponse } from './models/document.model'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentBuilder } from './documentBuilder'
import { GetDocumentListInput } from './dto/getDocumentListInput'
import { DocumentType } from './models/documentType.model'
import { DocumentSender } from './models/documentSender.model'
import { PaperMailBody } from './models/paperMail.model'
import { PostRequestPaperInput } from './dto/postRequestPaperInput'
import { PostMailActionInput } from './dto/postMailActionInput'
import { ActionMailBody } from './models/actionMail.model'
import { PostBulkMailActionInput } from './dto/postBulkMailActionInput'
import { isDefined } from '@island.is/shared/utils'
import {
  CategoryDTO,
  CustomersListDocumentsOrderEnum,
  CustomersListDocumentsSortByEnum,
  DocumentInfoDTO,
  DocumentsClientService,
} from '@island.is/clients/documents'

const LOG_CATEGORY = 'documents-api'
@Injectable()
export class DocumentService {
  constructor(
    private documentClient: DocumentsClientService,
    private documentBuilder: DocumentBuilder,
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

    return (body?.messages || []).reduce(
      (result: Document[], documentMessage: DocumentInfoDTO) => {
        if (documentMessage)
          result.push(this.documentBuilder.buildDocument(documentMessage))
        return result
      },
      [],
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

    const { dateFrom, dateTo, sortBy, order, ...requestInput } = newInput
    const body = await this.documentClient.getDocumentList({
      kennitala: nationalId,
      sortBy: sortBy ? CustomersListDocumentsSortByEnum[sortBy] : undefined,
      order: order ? CustomersListDocumentsOrderEnum[order] : undefined,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      ...requestInput,
    })

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
  }

  async getCategories(nationalId: string): Promise<DocumentCategory[]> {
    const body = await this.documentClient.getCustomersCategories({
      kennitala: nationalId,
    })
    return (body?.categories || []).reduce(function (
      result: DocumentCategory[],
      category: CategoryDTO,
    ) {
      if (category) result.push(DocumentCategory.fromCategoryDTO(category))
      return result
    },
    [])
  }

  async getTypes(nationalId: string): Promise<DocumentType[]> {
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
    const res = await this.documentClient.requestPaperMail({
      kennitala: nationalId,
    })
    return {
      nationalId: res?.kennitala,
      wantsPaper: res?.wantsPaper,
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
      const res = await this.documentClient.updatePaperMailPreferance({
        kennitala: nationalId,
        paperMail: postBody,
      })

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
    const { action, nationalId, messageId } = body

    try {
      switch (action) {
        case 'archive':
          await this.documentClient.archiveMail({
            kennitala: nationalId,
            messageId,
          })
          break
        case 'unarchive':
          await this.documentClient.unArchiveMail({
            kennitala: nationalId,
            messageId,
          })
          break
        case 'bookmark':
          await this.documentClient.bookmarkMail({
            kennitala: nationalId,
            messageId,
          })
          break
        case 'unbookmark':
          await this.documentClient.unbookmarkMail({
            kennitala: nationalId,
            messageId,
          })
          break
      }

      return {
        success: true,
        messageId: body.messageId,
        action: body.action,
      }
    } catch (e) {
      logger.error('Post mail action failed', {
        category: LOG_CATEGORY,
        error: e,
        success: false,
        messageId: body.messageId,
        action: body.action,
      })
      throw e
    }
  }

  async bulkMailAction(body: PostBulkMailActionInput): Promise<ActionMailBody> {
    const messageIds = body.messageIds ?? []
    const stringIds = messageIds.toString()

    switch (body.action) {
      case 'archive':
        await this.documentClient.batchArchiveMail({
          kennitala: body.nationalId,
          batchRequest: {
            ids: messageIds,
            status: body.status,
          },
        })
        break
      case 'bookmark':
        await this.documentClient.batchBookmarkMail({
          kennitala: body.nationalId,
          batchRequest: {
            ids: messageIds,
            status: body.status,
          },
        })
        break
      case 'read':
        await this.documentClient.batchReadMail({
          kennitala: body.nationalId,
          request: {
            ids: messageIds,
          },
        })
        break
      default:
        return {
          success: false,
          messageId: stringIds,
        }
    }
    return {
      success: true,
      messageId: stringIds,
    }
  }
}
