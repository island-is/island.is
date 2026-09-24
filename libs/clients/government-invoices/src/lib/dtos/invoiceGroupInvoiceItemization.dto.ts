import { logger } from '@island.is/logging'
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
  id: string,
): InvoiceItemization | null => {
  if (!data.type?.code || !data.type?.name || data.accountedAmount == null) {
    logger.warn('Dropping invoice GL line with missing required fields', {
      category: 'government-invoices',
      lineId: id,
      hasType: !!data.type,
      hasCode: !!data.type?.code,
      hasName: !!data.type?.name,
      hasAmount: data.accountedAmount != null,
      isConfidential: data.type?.isConfidential ?? null,
    })
    return null
  }

  const type: InvoicePaymentTypeDto = {
    code: data.type.code,
    name: data.type.name,
    accountType: data.accountType ?? undefined,
    isConfidential: data.type.isConfidential ?? undefined,
  }

  return {
    id,
    title: data.type.name,
    invoicePaymentType: type,
    amount: data.accountedAmount,
  }
}
