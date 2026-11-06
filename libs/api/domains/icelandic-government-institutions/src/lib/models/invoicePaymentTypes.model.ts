import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoicePaymentType } from './invoicePaymentType.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentTypes')
export class InvoicePaymentTypeCollection extends PaginatedResponse(
  InvoicePaymentType,
) {}
