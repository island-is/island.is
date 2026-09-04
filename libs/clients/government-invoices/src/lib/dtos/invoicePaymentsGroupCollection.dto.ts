import { PageInfoDto } from '@island.is/nest/pagination'
import { isDefined } from '@island.is/shared/utils'
import { OpenInvoicesGroupCollectionResponseDto } from '../../../gen/fetch'
import {
  InvoicePaymentsGroupDto,
  mapInvoicePaymentsGroupDto,
} from './invoicePaymentsGroup.dto'
import { mapOffsetPageInfo } from '../utils/pageInfo.util'

export interface InvoicePaymentsGroupCollectionDto {
  totalCount: number
  totalPaymentsSum: number
  totalPaymentsCount: number
  invoiceGroups: InvoicePaymentsGroupDto[]
  pageInfo?: PageInfoDto
}

export const mapInvoicePaymentsGroupCollectionDto = (
  data: OpenInvoicesGroupCollectionResponseDto,
): InvoicePaymentsGroupCollectionDto | null => {
  if (
    data.totalCount == null ||
    data.totalPaymentsSum == null ||
    data.totalPaymentsCount == null
  ) {
    return null
  }
  return {
    totalCount: data.totalCount,
    totalPaymentsCount: data.totalPaymentsCount,
    totalPaymentsSum: data.totalPaymentsSum,
    invoiceGroups: (data.invoiceGroups ?? [])
      .map(mapInvoicePaymentsGroupDto)
      .filter(isDefined),
    pageInfo: data.pageInfo ? mapOffsetPageInfo(data.pageInfo) : undefined,
  }
}
