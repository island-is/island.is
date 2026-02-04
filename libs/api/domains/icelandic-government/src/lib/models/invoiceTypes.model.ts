import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceType } from './invoiceType.model'

@ObjectType('IcelandicGovernmentInvoiceTypes')
export class InvoiceTypes extends PaginatedResponse(InvoiceType) {}
