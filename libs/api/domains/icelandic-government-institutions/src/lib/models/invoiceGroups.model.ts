import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceGroup } from './invoiceGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoiceGroups')
export class InvoiceGroupCollection extends PaginatedResponse(InvoiceGroup) {
  @Field(() => Int)
  totalPaymentsSum!: number

  @Field(() => Int)
  totalPaymentsCount!: number
}
