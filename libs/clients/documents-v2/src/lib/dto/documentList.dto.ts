import { DocumentInfoDto } from './documentInfo.dto'

export type ListDocumentsDto = {
  totalCount: number
  unreadCount?: number
  documents: Array<DocumentInfoDto>
}
