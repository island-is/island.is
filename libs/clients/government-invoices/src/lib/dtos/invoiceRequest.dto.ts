export interface InvoiceRequestDto {
  supplierLegalId: string
  erpLegalEntityId: number
  dateFrom?: Date
  dateTo?: Date
  paymentTypeIds?: string[]
  ministries?: string[]
}
