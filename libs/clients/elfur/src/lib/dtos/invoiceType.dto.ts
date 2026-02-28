import { InvoiceTypeResponseDto } from '../../../gen/fetch'

export interface InvoiceTypeDto {
  code: string
  name: string
  description?: string
}

export const mapInvoiceTypeDto = (
  invoiceType: InvoiceTypeResponseDto,
): InvoiceTypeDto | null => {
  if (!invoiceType.code || !invoiceType.name) {
    return null
  }

  return {
    code: invoiceType.code,
    name: invoiceType.name,
    description: invoiceType.description ?? undefined,
  }
}
