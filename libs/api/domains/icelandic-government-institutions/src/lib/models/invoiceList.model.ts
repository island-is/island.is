import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceGroup } from './invoiceGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoices')
export class InvoiceList extends PaginatedResponse(InvoiceGroup) {}
