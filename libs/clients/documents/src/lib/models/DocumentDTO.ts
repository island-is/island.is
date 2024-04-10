export interface DocumentDTO {
  fileName?: string
  fileType?: string
  content?: string
  htmlContent?: string
  url?: string

  publicationDate?: Date
  bookmarked?: boolean
  archived?: boolean
  senderName?: string
  senderKennitala?: string
  subject?: string
  categoryId?: string
}
