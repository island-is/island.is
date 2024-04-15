import { DocumentDetails, DocumentV2Content } from '@island.is/api/schema'

type ActiveDoc = {
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
  categoryId?: string
  senderNatReg?: string
}

export type ActiveDocumentType = {
  document: DocumentDetails
} & ActiveDoc

export type ActiveDocumentType2 = {
  document: Partial<DocumentV2Content>
} & ActiveDoc
