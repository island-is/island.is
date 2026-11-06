import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import { InvoiceDto, mapInvoiceDto } from './invoice.dto'

export interface PaymentDto {
  id: string
  date: Date
  amount: number
  originalAmount: number | null
  currencyCode: string | null
  invoice: InvoiceDto
}

export const mapPaymentDto = (
  data: InvoicePaymentDetailResponseDto,
): PaymentDto | null => {
  if (
    !data.paymentGuid ||
    !data.paymentAccountingDate ||
    data.paymentAmountISK == null
  ) {
    return null
  }

  const invoice = mapInvoiceDto(data)

  if (!invoice) {
    return null
  }

  return {
    id: data.paymentGuid,
    date: new Date(data.paymentAccountingDate),
    amount: data.paymentAmountISK,
    originalAmount: data.paymentAmount ?? null,
    currencyCode: data.paymentCurrencyCode ?? null,
    invoice,
  }
}
