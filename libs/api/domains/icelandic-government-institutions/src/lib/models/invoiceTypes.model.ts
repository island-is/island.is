import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceType } from './invoiceType.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceTypes')
export class InvoiceTypes extends PaginatedResponse(InvoiceType) {}
