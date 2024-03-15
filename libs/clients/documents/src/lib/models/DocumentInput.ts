export type GetDocumentListInput = {
  senderKennitala?: string
  dateFrom?: string
  dateTo?: string
  categoryId?: string
  subjectContains?: string
  typeId?: string
  sortBy?: 'Date' | 'Category' | 'Type' | 'Subject' | 'Sender'
  order?: 'Ascending' | 'Descending'
  opened?: boolean
  archived?: boolean
  bookmarked?: boolean
  page?: number
  pageSize?: number
}
