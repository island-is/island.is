import { uuid } from 'uuidv4'
import { InvoiceGlLineResponseDto } from '../../../gen/fetch'
import { InvoicePaymentTypeDto } from './invoicePaymentType.dto'

export interface InvoiceItemization {
  id: string
  title: string
  invoicePaymentType: InvoicePaymentTypeDto
  amount: number
}

export const mapInvoiceGroupInvoiceItemization = (
  data: InvoiceGlLineResponseDto,
): InvoiceItemization | null => {
  if (!data.type?.code || !data.type?.name || !data.accountedAmount) {
    return null
  }

  const type: InvoicePaymentTypeDto = {
    code: data.type.code,
    name: data.type.name,
    accountType: data.accountType ?? undefined,
    isConfidential: data.type.isConfidential ?? undefined,
  }

  return {
    id: uuid(),
    title: data.type.name,
    invoicePaymentType: type,
    amount: data.accountedAmount,
  }
}
