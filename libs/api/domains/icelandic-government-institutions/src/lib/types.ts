import { InvoicePaymentsGroupCollection } from './models/invoicePaymentsGroups.model'
import { InvoicePaymentsGroup } from './models/invoicePaymentsGroup.model'

export type InvoicePaymentsGroupWithFilters = InvoicePaymentsGroup & {
  dateFrom?: Date
  dateTo?: Date
}

export type InvoicePaymentsGroupsWithFilters = InvoicePaymentsGroupCollection & {
  dateFrom?: Date
  dateTo?: Date
}
