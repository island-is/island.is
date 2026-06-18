export interface InvoiceGroupRequestDto {
  suppliers?: string[]
  debtors?: string[]
  ministries?: string[]
  paymentTypeIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  sortBy?: string
  sortDirection?: string
  limit?: number
  after?: string
  before?: string
}
