import { InvoiceGroupCollection } from './models/invoiceGroups.model'
import { InvoiceGroup } from './models/invoiceGroup.model'

export type InvoiceGroupWithFilters = InvoiceGroup & {
  dateFrom?: Date
  dateTo?: Date
  types?: string[]
}

export type InvoiceGroupsWithFilters = InvoiceGroupCollection & {
  dateFrom?: Date
  dateTo?: Date
  types?: string[]
}
