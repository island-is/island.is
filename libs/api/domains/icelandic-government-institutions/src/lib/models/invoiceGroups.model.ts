import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceGroup } from './invoiceGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroups')
export class InvoiceGroups extends PaginatedResponse(InvoiceGroup) {}
