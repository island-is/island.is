import { isDefined } from '@island.is/shared/utils'
import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import {
  InvoiceItemization,
  mapInvoiceGroupInvoiceItemization,
} from './invoiceGroupInvoiceItemization.dto'

export interface InvoiceGroupInvoiceDto {
  id: string
  timestamp: Date
  amount: number
  currencyCode: string
  itemization: Array<InvoiceItemization>
}

export const mapInvoiceGroupInvoice = (
  data: InvoicePaymentDetailResponseDto,
): InvoiceGroupInvoiceDto | null => {
  if (
    !data.invoiceNum ||
    !data.paymentAccountingDate ||
    !data.invoiceCurrencyCode
  ) {
    return null
  }

  return {
    id: data.invoiceNum,
    timestamp: new Date(data.paymentAccountingDate),
    amount: data.paymentAmountISK ?? 0,
    currencyCode: data.invoiceCurrencyCode,
    itemization: (data.glLines ?? [])
      .map(mapInvoiceGroupInvoiceItemization)
      .filter(isDefined),
  }
}
