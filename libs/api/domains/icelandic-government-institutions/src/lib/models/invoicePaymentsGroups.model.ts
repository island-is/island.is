import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { InvoicePaymentsGroup } from './invoicePaymentsGroup.model'

@ObjectType('IcelandicGovernmentInstitutionsInvoicePaymentsGroups')
export class InvoicePaymentsGroupCollection extends PaginatedResponse(
  InvoicePaymentsGroup,
) {
  @Field(() => Float)
  totalPaymentsSum!: number

  @Field(() => Int)
  totalPaymentsCount!: number
}
