import { Injectable } from '@nestjs/common'
import {
  CategoryDTO,
  DocumentInfoDTO,
  SenderDTO,
  TypeDTO,
} from '@island.is/clients/documents'
import { DocumentsClientV2Service } from '@island.is/clients/documents-v2'
import { Document, PaginatedDocuments } from './models/document.model'
import { FileType } from './models/documentContent.model'
import { DocumentsInput } from './models/listDocuments.input'
import { Category } from './models/category.model'
import { isDefined } from '@island.is/shared/utils'
import { HEALTH_CATEGORY_ID } from './document.types'

const LOG_CATEGORY = 'documents-api'
@Injectable()
export class DocumentService {
  constructor(private documentService: DocumentsClientV2Service) {}

  async findDocumentById(
    nationalId: string,
    documentId: string,
  ): Promise<Document | null> {
    const document = await this.documentService.getCustomersDocument(
      nationalId,
      documentId,
    )

    if (!document) {
      return null
    }

    let type
    switch (document.fileType) {
      case 'html':
        type = FileType.HTML
        break
      case 'pdf':
        type = FileType.PDF
        break
      case 'url':
        type = FileType.URL
        break
      default:
        type = FileType.UNKNOWN
    }

    return {
      ...document,
      publicationDate: document.date,
      id: documentId,
      name: document.fileName,
      sender: {
        id: document.senderNationalId,
        name: document.senderName,
      },
      content: {
        type,
        value: document.content,
      },
    }
  }

  async listDocuments(
    nationalId: string,
    input: DocumentsInput,
  ): Promise<PaginatedDocuments> {
    //If a delegated user is viewing the mailbox, do not return any health related data
    //Category is now "1,2,3,...,n"
    const { categoryIds, ...restOfInput } = input
    let mutableCategoryIds = categoryIds ?? []

    if (input.isLegalGuardian) {
      if (!mutableCategoryIds.length) {
        mutableCategoryIds = (await this.getCategories(nationalId, true)).map(
          (c) => c.id,
        )
      } else {
        mutableCategoryIds = mutableCategoryIds.filter(
          (c) => c === HEALTH_CATEGORY_ID,
        )
      }
    }

    const documents = await this.documentService.getDocumentList({
      ...restOfInput,
      categoryId: mutableCategoryIds.join(),
    })

    if (!documents?.totalCount) {
      throw new Error('Incomplete response')
    }

    const documentData: Array<Document> =
      documents?.documents
        .map((d) => {
          if (!d) {
            return null
          }

          return {
            ...d,
            id: d.id,
            sender: {
              name: d.senderName,
              id: d.senderNationalId,
            },
          }
        })
        .filter(isDefined) ?? []

    return {
      data: documentData,
      totalCount: documents?.totalCount,
      unreadCount: documents?.unreadCount,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getCategories(
    nationalId: string,
    filterHealth = false,
  ): Promise<Array<Category>> {
    const categories = await this.documentService.getCustomersCategories(
      nationalId,
    )

    return (
      categories.categories
        ?.map((c) => {
          if (!c.id || (filterHealth && c.id === HEALTH_CATEGORY_ID)) {
            return null
          }
          return {
            id: c.id,
            name: c.name,
          }
        })
        .filter(isDefined) ?? []
    )
  }
}
