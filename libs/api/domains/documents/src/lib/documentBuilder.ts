import { Inject, Injectable } from '@nestjs/common'

import { DocumentInfoDTO } from '@island.is/clients/documents'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

import { Document } from './models/document.model'
import { DocumentTypeFilter, FileType } from './types'

@Injectable()
export class DocumentBuilder {
  constructor(
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
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
      opened: fileType === FileType.URL, // URL documents should not display as unopened as they do not have the same behaviour as pdf documents.
    }
  }

  private getTypeFilter(
    document: DocumentInfoDTO,
  ): Pick<DocumentTypeFilter, 'url' | 'fileType'> {
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
    return `${this.downloadServiceConfig.baseUrl}/download/v1/electronic-documents/${document.id}`
  }
}
