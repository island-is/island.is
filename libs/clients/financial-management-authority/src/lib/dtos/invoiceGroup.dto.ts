import { OpenInvoiceGroupResponseDto } from '../../../gen/fetch'
import { CustomerDto, mapCustomerDto } from './customer.dto'
import { mapSupplierDto, SupplierDto } from './supplier.dto'

export interface InvoiceGroupDto {
  supplier: SupplierDto
  customer: CustomerDto
  paymentsSum: number
  paymentsCount: number
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

  if (!supplierDto || !customerDto) {
    return null
  }

  return {
    supplier: supplierDto,
    customer: customerDto,
    paymentsSum: invoiceGroup.totalPaymentsSum,
    paymentsCount: invoiceGroup.totalPaymentCount,
  }
}
