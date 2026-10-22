import { isDefined } from '@island.is/shared/utils'
import { InvoicePaymentDetailResponseDto } from '../../../gen/fetch'
import {
  InvoiceItemization,
  mapInvoiceGroupInvoiceItemization,
} from './invoiceGroupInvoiceItemization.dto'

export interface InvoiceDto {
  id: string
  number: string | null
  totalAmount: number | null
  itemization: Array<InvoiceItemization>
}

export const mapInvoiceDto = (
  data: InvoicePaymentDetailResponseDto,
): InvoiceDto | null => {
  if (!data.invoiceGuid) {
    return null
  }

  return {
    id: data.invoiceGuid,
    number: data.invoiceNum ?? null,
    totalAmount: data.invoiceTotalBaseAmountISK ?? null,
    itemization: (data.glLines ?? [])
      .map((line, index) =>
        mapInvoiceGroupInvoiceItemization(line, `${data.invoiceGuid}-${index}`),
      )
      .filter(isDefined),
  }
}
