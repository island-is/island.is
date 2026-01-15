export interface InvoiceRequestDto {
  limit?: number
  after?: string
  before?: string
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
  sellers?: number[]
  buyers?: number[]
}
