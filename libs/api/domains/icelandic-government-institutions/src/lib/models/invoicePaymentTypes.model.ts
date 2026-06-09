import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoicePaymentType } from './invoicePaymentType.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentTypes')
export class InvoicePaymentTypes extends PaginatedResponse(
  InvoicePaymentType,
) {}
