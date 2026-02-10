import {
  InvoicePaymentTypeDto,
  InvoicePaymentTypesDto,
} from '@island.is/clients/elfur'
import { InvoicePaymentType } from '../models/invoicePaymentType.model'
import { InvoicePaymentTypes } from '../models/invoicePaymentTypes.model'

export const mapInvoicePaymentType = (
  data: InvoicePaymentTypeDto,
): InvoicePaymentType => ({
  code: data.code,
  name: data.name,
  accountType: data.accountType,
  isConfidential: data.isConfidential,
})

export const mapInvoicePaymentTypes = (
  data: InvoicePaymentTypesDto,
): InvoicePaymentTypes => {
  const invoiceTypes: InvoicePaymentType[] = data.invoicePaymentTypes.map(
    mapInvoicePaymentType,
  )

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: invoiceTypes,
  }
}
