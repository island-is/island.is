import { InvoicePaymentTypeGroupDto } from '../dtos/invoicePaymentTypeGroup.dto'

export const groupIdentity = (group: InvoicePaymentTypeGroupDto) =>
  `${group.name}:${[...group.codes].sort().join(',')}`
