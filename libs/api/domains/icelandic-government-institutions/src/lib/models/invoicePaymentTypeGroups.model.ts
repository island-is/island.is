import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoicePaymentTypeGroup } from './invoicePaymentTypeGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentTypeGroups')
export class InvoicePaymentTypeGroups extends PaginatedResponse(
  InvoicePaymentTypeGroup,
) {}
