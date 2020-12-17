import { Injectable } from '@nestjs/common'
import { Document } from './models/document.model'
import { DocumentInfoDTO } from './client/models'
import { DocumentTypeFilter } from './types/documentTypeFilterType'
import { FileType } from './types/fileType.enum'

@Injectable()
export class DocumentBuilder {
  constructor() {}

  // Handling edge case for documents that cant be presented due to requiring authentication through rsk.is
  private static readonly customDocuments: DocumentTypeFilter[] = [
    {
      senderName: 'Ríkisskattstjóri',
      senderNatReg: '5402696029',
      subjectContains: 'Niðurstaða álagningar',
      url: 'https://thjonustusidur.rsk.is/alagningarsedill',
      fileType: FileType.URL,
    },
  ]

  public static buildDocument(documentDto: DocumentInfoDTO): Document {
    const builtDocument = Document.fromDocumentInfo(documentDto)
    const { url, fileType } = this.getTypeFilter(documentDto)
    return {
      ...builtDocument,
      url,
      fileType,
    }
  }

  private static getTypeFilter(
    document: DocumentInfoDTO,
  ): Partial<DocumentTypeFilter> {
    const found = this.customDocuments.find(
      (x) =>
        document.subject.includes(x.subjectContains) &&
        x.senderNatReg === document.senderKennitala,
    )
    if (found) return found
    return {
      url: '',
      fileType: FileType.PDF,
    }
  }
}
