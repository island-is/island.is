import { DocumentInfoDTO } from '../..'
import { DocumentDto } from './document.dto'

export interface DocumentInfoDto
  extends Omit<DocumentDto, 'fileName' | 'fileType' | 'content' | 'date'> {
  id: string
  senderNationalId: string
  publicationDate: Date
  senderName?: string
  documentDate?: Date
  withdrawn?: boolean
  widthdrawnReason?: string
  minimumAuthenticationType?: string
  urgent?: boolean
  replyable?: boolean
}

export const mapToDocumentInfoDto = (
  document: DocumentInfoDTO,
): DocumentInfoDto | null => {
  if (
    !document.publicationDate ||
    !document.senderKennitala ||
    !document.subject ||
    !document.id
  ) {
    return null
  }

  return {
    ...document,
    id: document.id,
    subject: document.subject,
    senderNationalId: document.senderKennitala,
    senderName: document.senderName,
    publicationDate: document.publicationDate,
    documentDate: document.documentDate,
  }
}
