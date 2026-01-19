import { isDefined } from '@island.is/shared/utils'
import { OpenInvoicesGroupCollectionResponseDto } from '../../../gen/fetch'
import { InvoiceGroupDto, mapInvoiceGroupDto } from './invoiceGroup.dto'

export interface InvoiceGroupCollectionDto {
  totalCount: number
  totalPaymentsSum: number
  totalPaymentsCount: number
  invoiceGroups: InvoiceGroupDto[]
}

export const mapInvoiceGroupCollectionDto = (
  data: OpenInvoicesGroupCollectionResponseDto,
): InvoiceGroupCollectionDto | null => {
  if (!data.totalCount || !data.totalPaymentsSum || !data.totalPaymentsCount) {
    return null
  }
  return {
    totalCount: data.totalCount,
    totalPaymentsCount: data.totalPaymentsCount,
    totalPaymentsSum: data.totalPaymentsSum,
    invoiceGroups: (data.invoiceGroups ?? [])
      .map(mapInvoiceGroupDto)
      .filter(isDefined),
  }
}
