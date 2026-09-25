import { PaymentDto } from '@island.is/clients/government-invoices'
import { Payment } from '../models/payment.model'
import { mapInvoice } from './invoiceMapper'

export const mapPayment = (data: PaymentDto): Payment => {
  return {
    id: data.id,
    date: data.date,
    amount: data.amount,
    invoice: mapInvoice(data.invoice),
  }
}
