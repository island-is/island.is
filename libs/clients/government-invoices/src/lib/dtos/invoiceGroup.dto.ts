import { isDefined } from '@island.is/shared/utils'
import { OpenInvoiceGroupResponseDto } from '../../../gen/fetch'
import { DebtorDto, mapDebtorDto } from './debtor.dto'
import { mapSupplierDto, SupplierDto } from './supplier.dto'
import {
  InvoiceGroupInvoiceDto,
  mapInvoiceGroupInvoice,
} from './invoiceGroupInvoice.dto'

export interface InvoiceGroupDto {
  supplier: SupplierDto
  debtor: DebtorDto
  paymentsSum: number
  paymentsCount: number
  invoices?: InvoiceGroupInvoiceDto[]
}

export const mapInvoiceGroupDto = (
  invoiceGroup: OpenInvoiceGroupResponseDto,
): InvoiceGroupDto | null => {
  if (
    !invoiceGroup.debtor ||
    !invoiceGroup.supplier ||
    !invoiceGroup.totalPaymentCount ||
    !invoiceGroup.totalPaymentsSum
  ) {
    return null
  }

  const supplierDto = mapSupplierDto(invoiceGroup.supplier)
  const debtorDto = mapDebtorDto(invoiceGroup.debtor)
  const invoicesDto = invoiceGroup?.invoices
    ?.map(mapInvoiceGroupInvoice)
    .filter(isDefined)

  if (!supplierDto || !debtorDto) {
    return null
  }

  return {
    supplier: supplierDto,
    debtor: debtorDto,
    paymentsSum: invoiceGroup.totalPaymentsSum,
    paymentsCount: invoiceGroup.totalPaymentCount,
    invoices: invoicesDto,
  }
}
