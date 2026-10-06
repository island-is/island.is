export interface InvoiceRequestDto {
  supplierLegalId: string
  debtorGuid: string
  dateFrom?: Date
  dateTo?: Date
  paymentTypeIds?: string[]
  ministries?: string[]
}
