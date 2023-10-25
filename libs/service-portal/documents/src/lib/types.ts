import { DocumentDetails } from '@island.is/api/schema'

export type ActiveDocumentType = {
  document: DocumentDetails
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
  categoryId?: string
}
