export interface OpenInvoicesDto {
  invoices: Array<OpenInvoiceDto> | null
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage?: boolean
    startCursor?: string
    endCursor?: string
  }
  totalCount: number
}

export interface OpenInvoiceDto {
  cacheId: number
  id: string
}
