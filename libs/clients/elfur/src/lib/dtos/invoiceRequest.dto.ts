export interface InvoiceRequestDto {
  supplier: number
  customer: number
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}
