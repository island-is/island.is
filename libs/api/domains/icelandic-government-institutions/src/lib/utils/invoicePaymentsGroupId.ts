import { createHash } from 'crypto'

export type InvoicePaymentsGroupScope = 'list' | 'detail'

export interface ContentFilters {
  dateFrom?: Date
  dateTo?: Date
  paymentTypeIds?: string[]
  ministries?: string[]
}

export const buildInvoicePaymentsGroupId = (
  debtorId: string,
  supplierId: string,
  scope: InvoicePaymentsGroupScope,
  filters: ContentFilters,
): string => {
  const fingerprint = createHash('sha256')
    .update(
      JSON.stringify({
        scope,
        dateFrom: filters.dateFrom ?? null,
        dateTo: filters.dateTo ?? null,
        paymentTypeIds: [...(filters.paymentTypeIds ?? [])].sort(),
        ministries: [...(filters.ministries ?? [])].sort(),
      }),
    )
    .digest('hex')
    .slice(0, 12)

  return `${debtorId}-${supplierId}-${fingerprint}`
}
