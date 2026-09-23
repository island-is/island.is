import { isDefined } from '@island.is/shared/utils'
import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import {
  InvoiceItemization,
  mapInvoiceGroupInvoiceItemization,
} from './invoiceGroupInvoiceItemization.dto'

export interface InvoiceDto {
  id: string
  number: string | null
  numberRedacted: boolean
  totalAmount: number
  itemization: Array<InvoiceItemization>
}

export const mapInvoiceDto = (
  data: InvoicePaymentDetailResponseDto,
): InvoiceDto | null => {
  if (
    data.erpInvoiceId == null ||
    !data.invoiceCurrencyCode ||
    (!data.invoiceNum && !data.invoiceNumRedacted)
  ) {
    return null
  }

  return {
    id: String(data.erpInvoiceId),
    number: data.invoiceNum ?? null,
    numberRedacted: data.invoiceNumRedacted ?? false,
    totalAmount: data.invoiceTotalBaseAmountISK ?? 0,
    itemization: (data.glLines ?? [])
      .map(mapInvoiceGroupInvoiceItemization)
      .filter(isDefined),
  }
}
