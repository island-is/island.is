import { InvoiceDto } from './invoice.dto'

export interface OpenInvoicesDto {
  invoices: Array<InvoiceDto> | null
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage?: boolean
    startCursor?: string
    endCursor?: string
  }
  totalCount: number
}
