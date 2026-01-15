import { OpenInvoiceDetailResponseDto } from '../../../gen/fetch'

export interface InvoiceDto {
  id: number
  groupId: string
  number: string
  currency: string
  amount: number
  date: Date
  customerId: number
  customerName: string
  customerNationalId: string
  supplierId: number
  supplierName: string
  supplierNationalid: string
}

export const mapInvoiceDto = (
  invoice: OpenInvoiceDetailResponseDto,
): InvoiceDto | null => {
  if (
    !invoice.erpInvoiceId ||
    //!invoice.customerSupplierRelationshipId ||
    !invoice.invoiceNum ||
    !invoice.erpInvoiceAmountISK ||
    !invoice.invoiceCurrencyCode ||
    !invoice.apInvoiceGlDate ||
    !invoice.customerId ||
    !invoice.customerName ||
    !invoice.customerLegalId ||
    !invoice.supplierId ||
    !invoice.supplierName ||
    !invoice.supplierLegalId
  ) {
    return null
  }

  return {
    id: invoice.erpInvoiceId,
    //groupId: invoice.customerSupplierRelationshipId,
    groupId: '0',
    number: invoice.invoiceNum,
    currency: invoice.invoiceCurrencyCode,
    amount: invoice.erpInvoiceAmountISK,
    date: new Date(invoice.apInvoiceGlDate),
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    customerNationalId: invoice.customerLegalId,
    supplierId: invoice.supplierId,
    supplierName: invoice.supplierName,
    supplierNationalid: invoice.supplierLegalId,
  }
}
