import { TegundResponseDto } from '../../../gen/fetch'

export interface InvoicePaymentTypeDto {
  code: string
  name: string
  accountType?: string
  isConfidential?: boolean
}

export const mapInvoicePaymentTypeDto = (
  invoiceType: TegundResponseDto,
): InvoicePaymentTypeDto | null => {
  if (!invoiceType.id || !invoiceType.code || !invoiceType.name) {
    return null
  }

  return {
    code: invoiceType.code,
    name: invoiceType.name,
    accountType: invoiceType.accountType ?? undefined,
    isConfidential: invoiceType.isConfidential ?? undefined,
  }
}
