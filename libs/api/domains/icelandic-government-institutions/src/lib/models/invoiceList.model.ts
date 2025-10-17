import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Invoice } from './invoice.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoices')
export class InvoiceList extends PaginatedResponse(Invoice) {}
