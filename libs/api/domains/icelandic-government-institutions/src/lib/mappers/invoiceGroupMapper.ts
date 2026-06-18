import { InvoiceGroupDto } from '@island.is/clients/government-invoices'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { mapInvoice } from './invoiceMapper'
import { isDefined } from '@island.is/shared/utils'

export const mapInvoiceGroup = (data: InvoiceGroupDto): InvoiceGroup => {
  return {
    id: `${data.debtor.legalId}-${data.supplier.legalId}`,
    supplier: {
      id: data.supplier.legalId,
      name: data.supplier.name,
      isConfidential: data.supplier.isConfidential,
      isPrivateProxy: data.supplier.isPrivateProxy,
    },
    debtor: { id: data.debtor.legalId, name: data.debtor.name },
    totalSum: data.paymentsSum,
    totalCount: data.paymentsCount,
    invoices: data.invoices?.map(mapInvoice).filter(isDefined),
  }
}
