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
      String(data.debtor.erpLegalEntityId),
      data.supplier.legalId,
      scope,
      filters,
    ),
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
