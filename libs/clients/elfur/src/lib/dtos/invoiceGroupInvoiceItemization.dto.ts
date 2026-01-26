import { uuid } from 'uuidv4'
import { InvoiceGLLineResponseDto } from '../../../gen/fetch'

export interface InvoiceItemization {
  id: string
  title: string
  amount: number
}

export const mapInvoiceGroupInvoiceItemization = (
  data: InvoiceGLLineResponseDto,
): InvoiceItemization | null => {
  //Todo: IS CONFIDENTIAL STUFF
  if (!data.tegundName || !data.accountedAmount) {
    return null
  }
  return {
    id: uuid(),
    title: data.tegundName,
    amount: data.accountedAmount,
  }
}
