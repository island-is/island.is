import { PaymentTypeResponseDto } from '../../../gen/fetch'

export interface InvoicePaymentTypeDto {
  code: string
  name: string
  accountType?: string
  isConfidential?: boolean
}

export const mapInvoicePaymentTypeDto = (
  paymentType: PaymentTypeResponseDto,
): InvoicePaymentTypeDto | null => {
  if (!paymentType.code || !paymentType.name) {
    return null
  }

  return {
    code: paymentType.code,
    name: paymentType.name,
  }
}
