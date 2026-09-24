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
  totalAmount: number | null
  itemization: Array<InvoiceItemization>
}

export const mapInvoiceDto = (
  data: InvoicePaymentDetailResponseDto,
): InvoiceDto | null => {
  if (
    data.erpInvoiceId == null ||
    (!data.invoiceNum && !data.invoiceNumRedacted)
  ) {
    return null
  }

  return {
    id: String(data.erpInvoiceId),
    number: data.invoiceNum ?? null,
    numberRedacted: data.invoiceNumRedacted ?? false,
    totalAmount: data.invoiceTotalBaseAmountISK ?? null,
    itemization: (data.glLines ?? [])
      .map((line, index) =>
        mapInvoiceGroupInvoiceItemization(
          line,
          `${data.erpInvoiceId}-${index}`,
        ),
      )
      .filter(isDefined),
  }
}
