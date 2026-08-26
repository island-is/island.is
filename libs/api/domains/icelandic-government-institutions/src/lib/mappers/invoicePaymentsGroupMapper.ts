import { InvoicePaymentsGroupDto } from '@island.is/clients/government-invoices'
import { InvoicePaymentsGroup } from '../models/invoicePaymentsGroup.model'
import { mapPayment } from './paymentMapper'

export const mapInvoicePaymentsGroup = (
  data: InvoicePaymentsGroupDto,
): InvoicePaymentsGroup => {
  return {
    id: `${data.debtor.erpLegalEntityId}-${data.supplier.legalId}`,
    supplier: {
      id: data.supplier.legalId,
      name: data.supplier.name,
      isConfidential: data.supplier.isConfidential,
      isPrivatePerson: data.supplier.isPrivatePerson,
      isPrivatePersonProxy: data.supplier.isPrivatePersonProxy,
    },
    debtor: {
      id: String(data.debtor.erpLegalEntityId),
      legalId: data.debtor.legalId,
      name: data.debtor.name,
    },
    totalPaymentsSum: data.totalPaymentsSum,
    totalPaymentsCount: data.totalPaymentsCount,
    payments: data.payments?.map(mapPayment),
  }
}
