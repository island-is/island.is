import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '@island.is/nest/pagination'

@InputType()
export class GetPaymentFlowsInput extends PaginationInput() {
  @Field(() => String, { nullable: true })
  search?: string
}
