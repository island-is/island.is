export type ListDocumentsInputDto = {
  nationalId: string
  senderNationalId?: string[]
  dateFrom?: Date
  dateTo?: Date
  categoryId?: string
  hiddenCategoryIds?: string
  typeId?: string
  subjectContains?: string
  archived?: boolean
  sortBy?: 'Date' | 'Category' | 'Type' | 'Sender' | 'Subject'
  order?: 'Ascending' | 'Descending'
  opened?: boolean
  page?: number
  pageSize?: number
  bookmarked?: boolean
}
