export interface DocumentInfoDTO {
  id: string
  documentDate: string
  senderKennitala: string
  senderName?: string
  subject: string
  categoryId?: string
  opened: boolean
  withdrawn?: boolean
  withdrawnReason?: string
  minumumAuthenticationType?: string
  bookmarked?: boolean
}
