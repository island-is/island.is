import { InvoiceDto } from './invoice.dto'
import { PageInfoDto } from '@island.is/nest/pagination'
import { OpenInvoiceGroupWithInvoicesResponseDto } from '../../../gen/fetch'
import { isDefined } from '@island.is/shared/utils'
import { mapSupplierDto, SupplierDto } from './supplier.dto'
import { CustomerDto, mapCustomerDto } from './customer.dto'
import {
  InvoiceGroupInvoiceDto,
  mapInvoiceGroupInvoice,
} from './invoiceGroupInvoice.dto'

export interface InvoiceGroupWithInvoicesDto {
  invoices: Array<InvoiceGroupInvoiceDto> | null
  //pageInfo: PageInfoDto
  //totalCount: number
  supplier: SupplierDto
  customer: CustomerDto
}

export const mapInvoiceGroupWithInvoicesDto = (
  data: OpenInvoiceGroupWithInvoicesResponseDto,
): InvoiceGroupWithInvoicesDto | null => {
  if (!data.supplier || !data.customer) {
    return null
  }

  const supplierDto = mapSupplierDto(data.supplier)
  const customerDto = mapCustomerDto(data.customer)

  if (!supplierDto || !customerDto) {
    return null
  }

  return {
    invoices:
      data.invoices?.map(mapInvoiceGroupInvoice).filter(isDefined) ?? [],
    supplier: supplierDto,
    customer: customerDto,
  }
}

export interface OpenInvoicesDto {
  invoices: Array<InvoiceDto> | null
  pageInfo: PageInfoDto
  totalCount: number
}
