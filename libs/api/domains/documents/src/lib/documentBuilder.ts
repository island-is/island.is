import { Inject, Injectable } from '@nestjs/common'
import { DocumentInfoDTO } from '@island.is/clients/documents'
import { Document } from './models/document.model'
import {
  DocumentTypeFilter,
  DownloadServiceConfig,
  DOWNLOAD_SERVICE_CONFIG,
  FileType,
} from './types'

@Injectable()
export class DocumentBuilder {
  constructor(
    @Inject(DOWNLOAD_SERVICE_CONFIG)
    private downloadServiceConfig: DownloadServiceConfig,
  ) {}

  // Handling edge case for documents that cant be presented due to requiring authentication through rsk.is
  private readonly customDocuments: DocumentTypeFilter[] = [
    {
      senderName: 'Ríkisskattstjóri',
      senderNatReg: '5402696029',
      subjectContains: 'Niðurstaða álagningar',
      url: 'https://thjonustusidur.rsk.is/alagningarsedill',
      fileType: FileType.URL,
    },
  ]

  public buildDocument(documentDto: DocumentInfoDTO): Document {
    const builtDocument = Document.fromDocumentInfo(documentDto)
    const { url, fileType } = this.getTypeFilter(documentDto)
    return {
      ...builtDocument,
      url,
      fileType,
    }
  }

  private getTypeFilter(
    document: DocumentInfoDTO,
  ): Partial<DocumentTypeFilter> {
    const found = this.customDocuments.find(
      (x) =>
        document.subject.includes(x.subjectContains) &&
        x.senderNatReg === document.senderKennitala,
    )
    if (found) return found
    return {
      url: this.formatDownloadServiceUrl(document),
      fileType: FileType.PDF,
    }
  }

  private formatDownloadServiceUrl(document: DocumentInfoDTO): string {
    return `${this.downloadServiceConfig.downloadServiceBaseUrl}/download/v1/electronic-documents/${document.id}`
  }
}
