import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '@island.is/nest/pagination'

@InputType()
export class GetPaymentFlowsInput extends PaginationInput() {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => String, { nullable: true })
  before?: string
}
