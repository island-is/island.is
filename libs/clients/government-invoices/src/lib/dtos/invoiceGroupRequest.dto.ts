export interface InvoiceGroupRequestDto {
  suppliers?: string[]
  debtors?: number[]
  ministries?: string[]
  paymentTypeIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  sortBy?: string
  sortDirection?: string
  limit?: number
  page?: number
}
