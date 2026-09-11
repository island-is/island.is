import { isDefined } from '@island.is/shared/utils'
import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import {
  InvoiceItemization,
  mapInvoiceGroupInvoiceItemization,
} from './invoiceGroupInvoiceItemization.dto'

export interface InvoiceDto {
  id: string
  number: string
  totalAmount: number
  itemization: Array<InvoiceItemization>
}

export const mapInvoiceDto = (
  data: InvoicePaymentDetailResponseDto,
): InvoiceDto | null => {
  if (
    data.erpInvoiceId == null ||
    !data.invoiceNum ||
    !data.invoiceCurrencyCode
  ) {
    return null
  }

  return {
    id: String(data.erpInvoiceId),
    number: data.invoiceNum,
    totalAmount: data.invoiceTotalBaseAmountISK ?? 0,
    itemization: (data.glLines ?? [])
      .map(mapInvoiceGroupInvoiceItemization)
      .filter(isDefined),
  }
}
