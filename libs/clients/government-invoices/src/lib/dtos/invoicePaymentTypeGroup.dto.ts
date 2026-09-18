import { PaymentTypeGroupResponseDto } from '../../../gen/fetch'

export interface InvoicePaymentTypeGroupDto {
  name: string
  codes: string[]
  codeCount?: number
}

export const mapInvoicePaymentTypeGroupDto = (
  group: PaymentTypeGroupResponseDto,
): InvoicePaymentTypeGroupDto | null => {
  if (!group.name) {
    return null
  }

  return {
    name: group.name,
    codes: group.codes ?? [],
    codeCount: group.codeCount ?? undefined,
  }
}
