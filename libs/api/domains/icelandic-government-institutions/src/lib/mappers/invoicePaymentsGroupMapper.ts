import { InvoicePaymentsGroupDto } from '@island.is/clients/government-invoices'
import { InvoicePaymentsGroup } from '../models/invoicePaymentsGroup.model'
import {
  buildInvoicePaymentsGroupId,
  ContentFilters,
  InvoicePaymentsGroupScope,
} from '../utils/invoicePaymentsGroupId'
import { mapPayment } from './paymentMapper'

export const mapInvoicePaymentsGroup = (
  data: InvoicePaymentsGroupDto,
  scope: InvoicePaymentsGroupScope,
  filters: ContentFilters,
): InvoicePaymentsGroup => {
  return {
    id: buildInvoicePaymentsGroupId(
      data.debtor.debtorGuid,
      data.supplier.legalId,
      scope,
      filters,
    ),
    supplier: {
      id: data.supplier.legalId,
      name: data.supplier.name,
    },
    debtor: {
      id: data.debtor.debtorGuid,
      legalId: data.debtor.legalId,
      name: data.debtor.name,
    },
    totalPaymentsSum: data.totalPaymentsSum,
    totalPaymentsCount: data.totalPaymentsCount,
    payments: data.payments?.map(mapPayment),
  }
}
