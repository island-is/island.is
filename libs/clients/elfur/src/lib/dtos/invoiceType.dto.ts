import { InvoiceTypeResponseDto } from '../../../gen/fetch'

export interface InvoiceTypeDto {
  id: number
  code: string
  name: string
  description: string
}

export const mapInvoiceTypeDto = (
  invoiceType: InvoiceTypeResponseDto,
): InvoiceTypeDto | null => {
  if (
    !invoiceType.id ||
    !invoiceType.code ||
    !invoiceType.name ||
    !invoiceType.description
  ) {
    return null
  }

  return {
    id: invoiceType.id,
    code: invoiceType.code,
    name: invoiceType.name,
    description: invoiceType.description,
  }
}
