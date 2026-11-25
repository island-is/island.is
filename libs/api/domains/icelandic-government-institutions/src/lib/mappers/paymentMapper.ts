import { PaymentDto } from '@island.is/clients/government-invoices'
import { Payment } from '../models/payment.model'
import { mapInvoice } from './invoiceMapper'

const isPartialPayment = ({
  originalAmount,
  currencyCode,
  invoice,
}: PaymentDto) =>
  !!currencyCode &&
  currencyCode === invoice.currencyCode &&
  originalAmount != null &&
  invoice.originalTotalAmount != null &&
  originalAmount !== invoice.originalTotalAmount

export const mapPayment = (data: PaymentDto): Payment => {
  return {
    id: data.id,
    date: data.date,
    amount: data.amount,
    isPartialPayment: isPartialPayment(data),
    invoice: mapInvoice(data.invoice),
  }
}
