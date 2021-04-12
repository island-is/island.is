export interface DocumentInfoDTO {
  id?: string
  documentDate?: Date
  senderKennitala?: string
  senderName?: string
  subject?: string
  categoryId?: string
  opened?: boolean
  withdrawn?: boolean
  withdrawnReason?: string
  minumumAuthenticationType?: string
}
