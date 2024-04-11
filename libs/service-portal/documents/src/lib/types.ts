import { DocumentDetails, DocumentV2Content } from '@island.is/api/schema'

export type ActiveDocumentType = {
  document: DocumentDetails
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
  categoryId?: string
  senderNatReg?: string
}

export type ActiveDocumentType2 = {
  document: Partial<DocumentV2Content>
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
  categoryId?: string
  senderNatReg?: string
}
