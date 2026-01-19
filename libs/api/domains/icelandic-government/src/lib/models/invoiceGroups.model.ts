import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoiceGroup } from './invoiceGroup.model'

@ObjectType('IcelandicGovernmentInvoiceGroups')
export class InvoiceGroups extends PaginatedResponse(InvoiceGroup) {
  @Field(() => Int)
  totalPaymentsSum!: number

  @Field(() => Int)
  totalPaymentsCount!: number
}
