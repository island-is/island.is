import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceGroup } from './invoiceGroup.model'

@ObjectType('IcelandicGovernmentInvoices')
export class Invoices extends PaginatedResponse(InvoiceGroup) {}
