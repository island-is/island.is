import { uuid } from 'uuidv4'
import { InvoiceGlLineResponseDto } from '../../../gen/fetch'
import { InvoiceTypeDto, mapInvoiceTypeDto } from './invoiceType.dto'

export interface InvoiceItemization {
  id: string
  title: string
  invoiceType: InvoiceTypeDto
  amount: number
}

export const mapInvoiceGroupInvoiceItemization = (
  data: InvoiceGlLineResponseDto,
): InvoiceItemization | null => {
  //Todo: IS CONFIDENTIAL STUFF
  if (!data.type?.name || !data.accountedAmount || !data.type) {
    return null
  }

  const type = mapInvoiceTypeDto(data.type)
  if (!type) {
    return null
  }

  return {
    id: uuid(),
    title: data.type.name,
    invoiceType: type,
    amount: data.accountedAmount,
  }
}
