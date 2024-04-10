import { DocumentInfoDTO } from './'

export interface ListDocumentsResponse {
  messages?: Array<DocumentInfoDTO>
  totalCount?: number
  unreadCount?: number
}
