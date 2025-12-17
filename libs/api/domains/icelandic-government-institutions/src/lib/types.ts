import { InvoiceGroup } from './models/invoiceGroup.model'
import { InvoiceGroups } from './models/invoiceGroups.model'

export type InvoiceGroupWithFilters = InvoiceGroup & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}

export type InvoiceGroupsWithFilters = InvoiceGroups & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}
