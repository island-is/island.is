import { isDefined } from '@island.is/shared/utils'
import { OpenInvoiceGroupResponseDto } from '../../../gen/fetch'
import { DebtorDto, mapDebtorDto } from './debtor.dto'
import { mapSupplierDto, SupplierDto } from './supplier.dto'
import { PaymentDto, mapPaymentDto } from './payment.dto'

export interface InvoicePaymentsGroupDto {
  supplier: SupplierDto
  debtor: DebtorDto
  totalPaymentsSum: number
  totalPaymentsCount: number
  payments?: PaymentDto[]
}

export const mapInvoicePaymentsGroupDto = (
  invoiceGroup: OpenInvoiceGroupResponseDto,
): InvoicePaymentsGroupDto | null => {
  if (
    !invoiceGroup.debtor ||
    !invoiceGroup.supplier ||
    invoiceGroup.totalPaymentCount == null ||
    invoiceGroup.totalPaymentsSum == null
  ) {
    return null
  }

  const supplierDto = mapSupplierDto(invoiceGroup.supplier)
  const debtorDto = mapDebtorDto(invoiceGroup.debtor)
  const paymentsDto = invoiceGroup?.invoices
    ?.map(mapPaymentDto)
    .filter(isDefined)

  if (!supplierDto || !debtorDto) {
    return null
  }

  return {
    supplier: supplierDto,
    debtor: debtorDto,
    totalPaymentsSum: invoiceGroup.totalPaymentsSum,
    totalPaymentsCount: invoiceGroup.totalPaymentCount,
    payments: paymentsDto,
  }
}
