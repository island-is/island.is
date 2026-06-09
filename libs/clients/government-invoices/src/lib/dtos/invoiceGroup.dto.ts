import { isDefined } from '@island.is/shared/utils'
import { OpenInvoiceGroupResponseDto } from '../../../gen/fetch'
import { CustomerDto, mapCustomerDto } from './customer.dto'
import { mapSupplierDto, SupplierDto } from './supplier.dto'
import {
  InvoiceGroupInvoiceDto,
  mapInvoiceGroupInvoice,
} from './invoiceGroupInvoice.dto'

export interface InvoiceGroupDto {
  supplier: SupplierDto
  customer: CustomerDto
  paymentsSum: number
  paymentsCount: number
  invoices?: InvoiceGroupInvoiceDto[]
}

export const mapInvoiceGroupDto = (
  invoiceGroup: OpenInvoiceGroupResponseDto,
): InvoiceGroupDto | null => {
  if (
    !invoiceGroup.customer ||
    !invoiceGroup.supplier ||
    !invoiceGroup.totalPaymentCount ||
    !invoiceGroup.totalPaymentsSum
  ) {
    return null
  }

  const supplierDto = mapSupplierDto(invoiceGroup.supplier)
  const customerDto = mapCustomerDto(invoiceGroup.customer)
  const invoicesDto = invoiceGroup?.invoices
    ?.map(mapInvoiceGroupInvoice)
    .filter(isDefined)

  if (!supplierDto || !customerDto) {
    return null
  }

  return {
    supplier: supplierDto,
    customer: customerDto,
    paymentsSum: invoiceGroup.totalPaymentsSum,
    paymentsCount: invoiceGroup.totalPaymentCount,
    invoices: invoicesDto,
  }
}
