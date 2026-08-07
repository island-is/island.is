import { OpenInvoiceSortFields, SortDirections } from '../../../gen/fetch'

export { OpenInvoiceSortFields, SortDirections }

export interface InvoiceGroupRequestDto {
  suppliers?: string[]
  debtors?: number[]
  ministries?: string[]
  paymentTypeIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  sortBy?: OpenInvoiceSortFields
  sortDirection?: SortDirections
  limit?: number
  page?: number
}
