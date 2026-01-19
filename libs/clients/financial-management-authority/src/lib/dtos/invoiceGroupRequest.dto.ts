export interface InvoiceGroupRequestDto {
  suppliers?: number[]
  customers?: number[]
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}
