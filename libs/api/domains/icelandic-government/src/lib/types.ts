import { InvoiceGroups } from './models/invoiceGroups.model'
import { InvoiceGroupWithInvoices } from './models/invoiceGroupWithInvoices.model'

export type InvoiceGroupWithFilters = InvoiceGroupWithInvoices & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}

export type InvoiceGroupsWithFilters = InvoiceGroups & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}
