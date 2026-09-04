import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { InvoiceDto, mapInvoiceDto } from './invoice.dto'

export interface PaymentDto {
  id: string
  date: Date
  amount: number
  invoice: InvoiceDto
}

export const mapPaymentDto = (
  data: InvoicePaymentDetailResponseDto,
): PaymentDto | null => {
  if (
    data.erpInvoicePaymentId == null ||
    !data.paymentAccountingDate ||
    !data.paymentCurrencyCode
  ) {
    return null
  }

  const invoice = mapInvoiceDto(data)

  if (!invoice) {
    return null
  }

  return {
    id: String(data.erpInvoicePaymentId),
    date: new Date(data.paymentAccountingDate),
    amount: data.paymentAmountISK ?? 0,
    invoice,
  }
}
