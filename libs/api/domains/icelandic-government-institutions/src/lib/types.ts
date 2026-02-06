import { InvoiceGroupCollection } from './models/invoiceGroups.model'
import { InvoiceGroup } from './models/invoiceGroup.model'

export type InvoiceGroupWithFilters = InvoiceGroup & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}

export type InvoiceGroupsWithFilters = InvoiceGroupCollection & {
  dateFrom?: Date
  dateTo?: Date
  types?: number[]
}
